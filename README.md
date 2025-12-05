# O'zbekiston temir yo'llari - Boshqaruv platformasi

O'zbekiston temir yo'llari uchun yaratilgan boshqaruv platformasi. Platforma temir yo'l operatsiyalarini, xodimlarni, reyslarni va boshqa muhim ma'lumotlarni boshqarish imkonini beradi.

## Xususiyatlar

- 🚂 **Reyslar boshqaruvi** - Temir yo'l reyslarini kuzatish va boshqarish
- 👥 **Xodimlar boshqaruvi** - Xodimlar ro'yxati va ma'lumotlarini boshqarish
- ⛽ **Yoqilg'i operatsiyalari** - Yoqilg'i operatsiyalarini kuzatish
- 💰 **To'lov operatsiyalari** - To'lov operatsiyalarini boshqarish
- 📊 **Hisobotlar** - Batafsil hisobotlar va statistikalar
- 🌐 **Ko'p tillilik** - O'zbek, Rus va Ingliz tillarida qo'llab-quvvatlash

## Texnologiyalar

- React 18.3.1
- Ant Design 5.24.3
- React Router DOM 6.22.3
- React Query (TanStack Query)
- SCSS

## O'rnatish

```bash
npm install
```

## Ishga tushirish

Development rejimida ishga tushirish:

```bash
npm start
```

Brauzerda [http://localhost:3000](http://localhost:3000) ochiladi.

## Build

Production uchun build:

```bash
npm run build
```

## Struktura

```
src/
├── components/     # Komponentlar
├── pages/         # Sahifalar
│   ├── employees/ # Xodimlar sahifasi
│   ├── flights/   # Reyslar sahifasi
│   └── ...
├── styles/        # Global stillar
├── consts/        # Konstantalar
└── utils/         # Utility funksiyalar
```

## Litsenziya

Bu loyiha O'zbekiston temir yo'llari uchun yaratilgan.
