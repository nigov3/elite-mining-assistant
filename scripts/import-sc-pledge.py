"""Import the uploaded Star Citizen Wiki snapshot, without changing names or filling gaps."""
import csv
import json
import re
import sys
from pathlib import Path

HEADERS = ('Корабль или машина|Производитель|Тип техники|Категория|Назначение|Размер (класс)|'
           'Размер в магазине|Готовность|Наличие в магазине|Цена в магазине, $|'
           'Изначальная цена, $|Warbond (только за новые деньги), $|Изначальная цена Warbond, $|'
           'Временная замена|Средняя цена покупки, aUEC|Средняя аренда за сутки, aUEC|Длина, м|'
           'Ширина, м|Высота, м|Масса, кг|Экипаж: минимум|Экипаж: максимум|'
           'Инвентарь, мкSCU|Трюм, SCU|Скорость в режиме SCM, м/с|Макс. скорость, м/с|'
           'Крен, °/с|Тангаж, °/с|Рыскание, °/с|Дата анонса концепта|В игре с версии').split('|')
NUMERIC = {5, 9, 10, 11, 12, *range(14, 29)}
DESCRIPTIONS = {
    1: {'Aegis Dynamics':'Эгис Дайнэмикс', 'Anvil Aerospace':'Анвил Аэроспейс', 'Aopoa':'Аопоа',
        'Argo Astronautics':'Арго Астронавтикс', 'Banu Souli':'Бану Соули', 'Consolidated Outland':'Консолидейтед Аутленд',
        'Crusader Industries':'Крусейдер Индастриз', 'Drake Interplanetary':'Дрейк Интерплэнетари', 'Esperia':'Эсперия',
        'Gatac Manufacture':'Гатак Мануфактур', "Grey's Market":'Рынок Грея', 'Greycat Industrial':'Грейкэт Индастриал',
        'Kruger Intergalactic':'Крюгер Интергалактик', 'Mirai':'Мирай', 'Musashi Industrial and Starflight Concern':'Промышленно-космический концерн «Мусаси» (MISC)',
        'Origin Jumpworks':'Ориджин Джампворкс', 'Roberts Space Industries':'Робертс Спейс Индастриз (RSI)', 'Tumbril Land Systems':'Тамбрил Лэнд Системс'},
    2: {'Grav-lev vehicle':'Гравитационный транспорт', 'Ground vehicle':'Наземный транспорт', 'Spacecraft':'Космический корабль'},
    3: {'Combat':'Бой', 'Competition':'Соревнования', 'Exploration':'Исследования', 'Ground':'Наземные операции',
        'Industrial':'Промышленность', 'Multi-role':'Универсальные задачи', 'Support':'Поддержка', 'Transport':'Перевозки'},
    4: {'Anti-air':'Противовоздушная оборона', 'Anti-vehicle':'Борьба с техникой', 'Bomber':'Бомбардировщик',
        'Cargo':'Грузовой', 'Carrier':'Корабль-носитель', 'Combat':'Боевой', 'Combat power suit':'Боевой экзоскелет',
        'Corvette':'Корвет', 'Destroyer':'Эсминец', 'Dropship':'Десантный корабль', 'Expedition':'Экспедиционный',
        'Exploration':'Исследования', 'Recon':'Разведка', 'Fighter':'Истребитель', 'Fighter-bomber':'Истребитель-бомбардировщик',
        'Frigate':'Фрегат', 'Generalist':'Универсал', 'Gunship':'Корабль огневой поддержки',
        'Heavy bomber':'Тяжёлый бомбардировщик', 'Heavy dropship':'Тяжёлый десантный корабль', 'Heavy fighter':'Тяжёлый истребитель',
        'Heavy freight':'Тяжёлый грузовой', 'Heavy gunship':'Тяжёлый корабль огневой поддержки', 'Heavy lifter':'Тяжёлый транспорт',
        'Heavy refueling':'Тяжёлый заправщик', 'Heavy salvage':'Тяжёлая утилизация обломков', 'Heavy tank':'Тяжёлый танк',
        'Interceptor':'Перехватчик', 'Interdiction':'Принудительный перехват', 'Interdictor':'Корабль блокировки квантового полёта',
        'Light carrier':'Лёгкий корабль-носитель', 'Light fighter':'Лёгкий истребитель', 'Light freight':'Лёгкий грузовой',
        'Light mining':'Лёгкая добыча', 'Light refueling':'Лёгкий заправщик', 'Light salvage':'Лёгкая утилизация обломков',
        'Light science':'Лёгкий научный', 'Light tank':'Лёгкий танк', 'Luxury touring':'Элитный туристический',
        'Luxury transport':'Элитный пассажирский транспорт', 'Explorer':'Исследовательский', 'Medical':'Медицинский',
        'Medium cargo':'Средний грузовой', 'Medium data':'Перевозка данных (средний класс)', 'Medium fighter':'Средний истребитель',
        'Medium freight':'Средний грузовой', 'Medium repair':'Средний ремонтный', 'Medium refuel':'Средний заправщик',
        'Medium salvage':'Средняя утилизация обломков', 'Mining':'Добыча', 'Refining':'Переработка руды',
        'Missile carrier':'Ракетоносец', 'Modular':'Модульный', 'Modular gunship':'Модульный корабль огневой поддержки',
        'Multi-role':'Многоцелевой', 'Passenger':'Пассажирский', 'Pathfinder':'Разведчик маршрутов', 'Prospecting':'Поиск руды',
        'Racing':'Гоночный', 'Reconnaissance':'Разведка', 'Intelligence':'Сбор разведданных', 'Recovery':'Эвакуация техники',
        'Reporting':'Репортаж', 'Salvaging':'Утилизация обломков', 'Snub carrier':'Носитель малых аппаратов',
        'Snub fighter':'Истребитель малого класса', 'Starter':'Стартовый', 'Stealth bomber':'Малозаметный бомбардировщик',
        'Stealth fighter':'Малозаметный истребитель', 'Touring':'Туристический', 'Transporter':'Транспортный'},
    6: {'Capital':'Капитальный', 'Large':'Большой', 'Medium':'Средний', 'Small':'Малый',
        'Snub':'Сверхмалый', 'Vehicle':'Наземный или гравитационный'},
    7: {'Active for Squadron 42':'В производстве для Squadron 42', 'Active production':'В производстве',
        'Flight Ready':'Доступен в игре', 'Flight ready':'Доступен в игре', 'In concept':'На стадии концепта', 'Long term production':'Долгосрочная разработка'},
    8: {'(No longer available)':'Больше недоступен', 'Always available':'Всегда в продаже', 'Game mode exclusive':'Только в отдельном режиме игры',
        'Limited availability*':'Ограниченная доступность*', 'Limited edition (No longer available)':'Лимитированная серия (недоступна)',
        'Limited edition (Retired)':'Лимитированная серия (снята с продажи)', 'Limited edition*':'Лимитированная серия*',
        'Limited: Promotion only*':'Только по акции*', 'Limited: Reward purchase token':'Только с жетоном на покупку',
        'Limited: Store Bundle only':'Только в комплекте', 'Not available for sale':'Не продаётся', 'Out of production':'Снят с производства',
        'Out of production*':'Снят с производства*', 'Quantity-limited sales':'Ограниченный тираж', 'Retired':'Снят с продажи',
        'Reward - Not available for sale':'Награда, не продаётся', 'Time-limited sales':'Продаётся ограниченное время',
        '[https://robertsspaceindustries.com/en/comm-link/transmission/21336-RSI-Constellation-Mk-IV-Celebration Retiring]':'Выводится из продажи'}
}

def translate(index, value):
    if not value:
        return None
    if index in NUMERIC:
        return int(value) if re.fullmatch(r'\d+', value) else float(value)
    if index == 4:
        return ', '.join(DESCRIPTIONS[index][part] for part in value.split(', '))
    if index in DESCRIPTIONS:
        return DESCRIPTIONS[index][value]
    if index == 30:
        if value == 'Hangar Module':
            return 'Ангарный модуль'
        if value.startswith('Alpha '):
            return 'Альфа ' + value[6:]
        if value.startswith('Patch '):
            return 'Обновление ' + value[6:].lstrip('vV')
        raise ValueError(value)
    return value

if __name__ == '__main__':
    with open(sys.argv[1], encoding='utf-8-sig', newline='') as file:
        reader = csv.reader(file)
        keys = next(reader)
        assert len(keys) == len(HEADERS) == 31
        assert keys[:3] == ['Vehicle', 'Manufacturer', 'Type'] and keys[-1] == 'Flight ready'
        rows = list(reader)
        assert all(len(row) == len(HEADERS) for row in rows)
        assert len({row[0] for row in rows}) == len(rows)
        output = {'columns': HEADERS, 'rows': [[translate(i, v) for i, v in enumerate(row)] for row in rows]}
    path = Path(__file__).resolve().parents[1] / 'star-citizen' / 'pledge-vehicles-ru.json'
    path.write_text(json.dumps(output, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
