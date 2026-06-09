document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById('eventsContainer');
    const dropdownContainer = document.getElementById('dropdownContainer');

    // Находим кнопки всех 4 фильтров из ТЗ
    const filterDate = document.getElementById('filterDate');
    const filterType = document.getElementById('filterType');
    const filterDistance = document.getElementById('filterDistance');
    const filterCategory = document.getElementById('filterCategory');

    let activeFilter = null;
    
    // Переменные для хранения выбранных фильтров
    let selectedDate = null;
    let selectedType = null;
    let selectedDistance = null;
    let selectedCategory = null;

    // Опции для выпадающих списков, взятые прямо из текста ТЗ
    const dateOptions = [
        { label: 'Mar 13', value: 13 },
        { label: 'Mar 14', value: 14 },
        { label: 'Mar 16', value: 16 },
        { label: 'Mar 23', value: 23 }
    ];

    const typeOptions = [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
    ];

    const distanceOptions = [
        { label: '5 km', value: 5 },
        { label: '10 km', value: 10 },
        { label: '15 km', value: 15 },
        { label: '25 km', value: 25 },
        { label: '50 km', value: 50 },
        { label: '75 km', value: 75 },
        { label: '100 km', value: 100 },
    ];

    const categoryOptions = [
        { label: 'Social Activities', value: 'Social Activities' },
        { label: 'Hobbies and Passions', value: 'Hobbies and Passions' },
        { label: 'Health and Wellbeing', value: 'Health and Wellbeing' },
        { label: 'Business', value: 'Business' },
        { label: 'Technology', value: 'Technology' },
    ];

    // Форматирование даты под требования ТЗ (например: Wed, Mar 13 · 11:00 AM)
    function formatDate(date) {
        const months = ['Mar', 'Apr', 'May']; // Для наших моков достаточно марта
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const dayName = days[date.getDay()];
        const monthName = 'Mar'; // В моках везде март (индекс 2)
        const dayNum = date.getDate();
        
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const min = minutes < 10 ? '0' + minutes : minutes;
        
        return `${dayName}, ${monthName} ${dayNum} · ${hours}:${min} ${ampm}`;
    }

    // Отрисовка карточек
    function renderEvents(events) {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';

        if (events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-results">No events found for selected filters.</p>';
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
                    <p class="p2-card-row3">${event.category}${!isOnline && event.distance ? ' (' + event.distance + ' km)' : ''}</p>
                    <div class="p2-card-row4">
                        ${event.attendees ? '<span>' + event.attendees + ' attendees</span>' : ''}
                    </div>
                </div>
            `;
            eventsContainer.appendChild(card);
        });
    }

    // Логика фильтрации
    function filterEvents() {
        let filtered = [...eventsStore];

        if (selectedDate) {
            filtered = filtered.filter(event => event.date.getDate() === selectedDate);
        }

        if (selectedType) {
            filtered = filtered.filter(event => event.type === selectedType);
        }

        if (selectedDistance) {
            // Дистанция проверяется только у offline-событий
            filtered = filtered.filter(event => event.type === 'offline' ? event.distance <= selectedDistance : true);
        }

        if (selectedCategory) {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        renderEvents(filtered);
    }

    function closeDropdown() {
        dropdownContainer.innerHTML = '';
        activeFilter = null;
        document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    }

    // Открытие выпадающих списков под кнопками
    function openDropdown(type, options, currentValue, setter, buttonEl, defaultLabel) {
        if (activeFilter === type) {
            closeDropdown();
            return;
        }

        closeDropdown();
        activeFilter = type;
        buttonEl.classList.add('active');

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown open';

        const clearOption = document.createElement('div');
        clearOption.className = 'dropdown-option';
        clearOption.textContent = 'Any ' + type;
        clearOption.addEventListener('click', () => {
            setter(null);
            buttonEl.querySelector('span').textContent = defaultLabel;
            closeDropdown();
            filterEvents();
        });
        dropdown.appendChild(clearOption);

        options.forEach(opt => {
            const el = document.createElement('div');
            el.className = 'dropdown-option' + (currentValue === opt.value ? ' selected' : '');
            el.textContent = opt.label;
            el.addEventListener('click', () => {
                setter(opt.value);
                buttonEl.querySelector('span').textContent = opt.label; // Меняем текст кнопки на выбранный
                closeDropdown();
                filterEvents();
            });
            dropdown.appendChild(el);
        });

        dropdownContainer.appendChild(dropdown);
    }

    // Подключаем клики ко всем 4 кнопкам
    filterDate.addEventListener('click', () => {
        openDropdown('date', dateOptions, selectedDate, (v) => { selectedDate = v; }, filterDate, 'Any day');
    });

    filterType.addEventListener('click', () => {
        openDropdown('type', typeOptions, selectedType, (v) => { selectedType = v; }, filterType, 'Any type');
    });

    filterDistance.addEventListener('click', () => {
        openDropdown('distance', distanceOptions, selectedDistance, (v) => { selectedDistance = v; }, filterDistance, 'Any distance');
    });

    filterCategory.addEventListener('click', () => {
        openDropdown('category', categoryOptions, selectedCategory, (v) => { selectedCategory = v; }, filterCategory, 'Any category');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-chip') && !e.target.closest('.dropdown')) {
            closeDropdown();
        }
    });

    renderEvents(eventsStore);
});