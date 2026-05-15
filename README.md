# 🎲 Bulka Casino Pro

**Opis projektu i założenia techniczne:**
**Bulka Casino Pro** to w pełni interaktywna aplikacja webowa typu Single Page Application (SPA), stworzona w celach edukacyjnych jako zaawansowany projekt z informatyki. Głównym założeniem projektu było stworzenie funkcjonalnego symulatora gier kasynowych, który demonstruje praktyczne zastosowanie języka JavaScript (Vanilla JS) w manipulacji modelem DOM, asynchronicznej obsłudze zdarzeń (event-driven programming) oraz złożonym zarządzaniu stanem aplikacji (State Management). 

Całość logiki biznesowej działa całkowicie po stronie klienta (Client-Side), wykorzystując pamięć przeglądarki (`localStorage`) do symulowania relacyjnej bazy danych. Pozwoliło to na wdrożenie trwałego systemu kont, utrzymywania sesji użytkownika, zapisu salda oraz śledzenia postępów w czasie rzeczywistym. Interfejs został zaprojektowany od podstaw zgodnie z zasadami Responsive Web Design (RWD) w nowoczesnej, immersyjnej estetyce Cyber-Neon, oferując płynne animacje CSS, efekty dźwiękowe i intuicyjne doświadczenie użytkownika (UX) na dowolnym urządzeniu.

**Główne Funkcje:**
- **Automaty (Slots):** Zaawansowany silnik losujący z różnymi motywami gry, systemem mnożników oraz ukrytymi funkcjami (Easter Eggs) aktywowanymi specjalnymi kodami.
- **Blackjack Pro:** Symulator gry w karty z zaimplementowanym sztucznym krupierem (AI), autorskim algorytmem tasowania talii i pełną walidacją zasad (fura, podwojenie, remis).
- **Rzut Monetą (Coin Flip):** Szybka gra ryzyka (50/50) oparta na czystym prawdopodobieństwie z płynnymi animacjami CSS.
- **Zarządzanie Sesją:** Automatyczne logowanie i bezstratne zapisywanie postępów (salda) w lokalnej pamięci przeglądarki.
- **Turnieje na żywo:** Dynamiczna tabela liderów, która stale nasłuchuje zmian w saldzie gracza i aktualizuje jego pozycję w rankingu w czasie rzeczywistym.
- **Interaktywny Portfel:** System symulujący wpłaty depozytów z obsługą kodów promocyjnych i powiadomień systemowych (Toast Notifications).

---

### 📊 Log Prac Zespołu (Sprint Deweloperski)

| Osoba | Zadanie (Szczegółowy opis techniczny) | Czas |
| :--- | :--- | :--- |
| **Margo** | Szkice UX/UI i planowanie interfejsu (Figma). | 3h |
| **Vlad** | Projektowanie architektury stanu aplikacji (State Management). | 3h |
| **Margo** | Wdrożenie bazy semantycznej HTML5. | 3h |
| **Vlad** | Slots: Napisanie podstawowego silnika losującego. | 3h |
| **Vlad** | Slots: Logika matematyczna wygranych i mnożniki. | 4h |
| **Margo** | Architektura CSS i stylowanie w oparciu o BEM. | 3h |
| **Vlad** | Integracja LocalStorage (system zapisu salda). | 3h |
| **Margo** | Wdrożenie palety Cyber-Neon. | 2h |
| **Vlad** | Blackjack: Opracowanie algorytmu tasowania talii. | 3h |
| **Margo** | Wyszukiwanie, obróbka grafik i dobór ikon. | 2h |
| **Vlad** | Blackjack: Logika decyzyjna krupiera (AI). | 4h |
| **Margo** | CSS: Stworzenie animacji kręcących się bębnów. | 2h |
| **Vlad** | Blackjack: Walidacja zakładów i rozliczanie wygranych. | 3h |
| **Vlad** | System sesji i automatycznego logowania gracza. | 3h |
| **Margo** | RWD: Projektowanie wersji mobilnej (smartfony). | 2h |
| **Vlad** | Coin Flip: Logika i mechanika rzutu monetą. | 2h |
| **Vlad** | Tabela Liderów: Algorytm sortowania punktów. | 3h |
| **Margo** | QA: Testowanie logiki zakładów i wyłapywanie błędów. | 2h |
| **Vlad** | Tabela Liderów: Live update przy zmianie salda. | 3h |
| **Margo** | Redakcja dokumentacji i konfiguracja GitHub (README). | 2h |
| **Vlad** | Easter Eggs, bonusy i finalny debugging kodu JS. | 2h |

---

### 🛠 Podział ról i podsumowanie

**Vlad (38 godzin) — Lead Developer:**
* Konsekwentnie rozwijał logikę gier w JavaScript, dzieląc pracę na kilkugodzinne sesje dla poszczególnych modułów (Slots, Blackjack, Coin Flip).
* Opracował stabilny system zapisu postępów gracza w przeglądarce (LocalStorage) oraz mechanizm autologowania.
* Zaprojektował dynamiczną tabelę liderów, aktualizującą pozycje w czasie rzeczywistym na podstawie zmian w saldzie.

**Margo (21 godzin) — UI/UX Designer & QA:**
* Krok po kroku budowała interfejs w stylu Cyber-Neon, zaczynając od struktury HTML, a kończąc na płynnych animacjach CSS.
* Zadbała o pełną responsywność aplikacji na urządzeniach mobilnych i desktopowych.
* Przeprowadziła szczegółowe testy QA, wyłapując luki w interfejsie i pomagając dopracować finalny wygląd oraz logikę projektu.
