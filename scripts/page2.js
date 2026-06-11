document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById('eventsContainer');
    const dropdownContainer = document.getElementById('dropdownContainer');

    // кнопки фильтров из html
    const filterButtons = {
        date: document.getElementById('filterDate'),
        type: document.getElementById('filterType'),
        distance: document.getElementById('filterDistance'),
        category: document.getElementById('filterCategory')
    };

    let activeFilterType = null;
    
    // объект для хранения текущих выбранных фильтров
    const currentFilters = {
        date: null,
        type: null,
        distance: null,
        category: null
    };

    // списки опций строго по тз
    const optionsData = {
        date: [
            { label: 'Mar 13', value: 13 },
            { label: 'Mar 14', value: 14 },
            { label: 'Mar 16', value: 16 },
            { label: 'Mar 23', value: 23 }
        ],
        type: [
            { label: 'Online', value: 'online' },
            { label: 'Offline', value: 'offline' }
        ],
        distance: [
            { label: '5 km', value: 5 },
            { label: '10 km', value: 10 },
            { label: '15 km', value: 15 },
            { label: '25 km', value: 25 },
            { label: '50 km', value: 50 },
            { label: '75 km', value: 75 },
            { label: '100 km', value: 100 }
        ],
        category: [
            { label: 'Social Activities', value: 'Social Activities' },
            { label: 'Hobbies and Passions', value: 'Hobbies and Passions' },
            { label: 'Health and Wellbeing', value: 'Health and Wellbeing' },
            { label: 'Business', value: 'Business' },
            { label: 'Technology', value: 'Technology' }
        ]
    };

    // дефолтные тексты на кнопках
    const defaultLabels = {
        date: 'Any day',
        type: 'Any type',
        distance: 'Any distance',
        category: 'Any category'
    };

    // надежное форматирование даты через встроенный intl (выведет например: "Wed, Mar 13 · 11:00 AM")
    function formatDate(date) {
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        const datePart = date.toLocaleDateString('en-US', dateOptions);
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        
        return `${datePart} · ${hours}:${minutes} ${ampm}`;
    }

    // функция отрисовки карточек мероприятий
    function renderEvents(events) {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';

        if (events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-results">No events found matching your criteria.</p>';
            return;
        }

        events.forEach((event) => {
            const isOnline = event.type === 'online';

            const card = document.createElement('div');
            card.className = 'p2-event-card';

            card.innerHTML = `
                <div class="p2-event-img-wrapper">
                    ${isOnline ? '<span class="p2-online-badge">Online Event</span>' : ''}
                    <img src="${event.image}" alt="${event.title}" class="p2-event-card-img">
                </div>
                <div class="p2-event-card-info">
                    <p class="p2-card-row1">${formatDate(event.date)}</p>
                    <h3 class="p2-card-row2">${event.title}</h3>
                    <p class="p2-card-row3">
                        ${event.category} ${!isOnline && event.distance ? `(${event.distance} km)` : ''}
                    </p>
                    <div class="p2-card-row4">
                        ${event.attendees ? `<span>${event.attendees} attendees</span>` : '<span>0 attendees</span>'}
                    </div>
                </div>
            `;
            eventsContainer.appendChild(card);
        });
    }

    // корректная последовательная фильтрация по всем параметрам
    function filterEvents() {
        let filtered = [...eventsStore];

        if (currentFilters.date) {
            filtered = filtered.filter(event => event.date.getDate() === currentFilters.date);
        }

        if (currentFilters.type) {
            filtered = filtered.filter(event => event.type === currentFilters.type);
        }

        // если выбрана дистанция, автоматически отсекаем онлайн и проверяем километраж офлайна
        if (currentFilters.distance) {
            filtered = filtered.filter(event => event.type === 'offline' && event.distance <= currentFilters.distance);
        }

        if (currentFilters.category) {
            filtered = filtered.filter(event => event.category === currentFilters.category);
        }

        renderEvents(filtered);
    }

    function closeDropdown() {
        dropdownContainer.innerHTML = '';
        activeFilterType = null;
        document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    }

    // универсальное управление выпадающими списками
    function openDropdown(type) {
        if (activeFilterType === type) {
            closeDropdown();
            return;
        }

        closeDropdown();
        activeFilterType = type;
        
        const buttonEl = filterButtons[type];
        if (buttonEl) buttonEl.classList.add('active');

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown open';

        // опция сброса фильтра ("Any ...")
        const clearOption = document.createElement('div');
        clearOption.className = 'dropdown-option';
        clearOption.textContent = 'Any ' + type;
        clearOption.addEventListener('click', () => {
            currentFilters[type] = null;
            buttonEl.querySelector('span').textContent = defaultLabels[type];
            closeDropdown();
            filterEvents();
        });
        dropdown.appendChild(clearOption);

        // генерация пунктов списка на основе мок-данных из тз
        optionsData[type].forEach(opt => {
            const el = document.createElement('div');
            el.className = 'dropdown-option' + (currentFilters[type] === opt.value ? ' selected' : '');
            el.textContent = opt.label;
            el.addEventListener('click', () => {
                currentFilters[type] = opt.value;
                buttonEl.querySelector('span').textContent = opt.label;
                closeDropdown();
                filterEvents();
            });
            dropdown.appendChild(el);
        });

        dropdownContainer.appendChild(dropdown);
    }

    // привязка кликов к кнопкам фильтрации динамически в цикле
    Object.keys(filterButtons).forEach(type => {
        if (filterButtons[type]) {
            filterButtons[type].addEventListener('click', () => openDropdown(type));
        }
    });

    // закрытие выпадающего окна при клике в любое другое место экрана
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-chip') && !e.target.closest('.dropdown')) {
            closeDropdown();
        }
    });

    // стартовый рендер всех карточек при загрузке страницы
    renderEvents(eventsStore);
});