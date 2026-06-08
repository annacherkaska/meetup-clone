document.addEventListener("DOMContentLoaded", () => {

    const eventsContainer = document.getElementById('eventsContainer');
    const filterType = document.getElementById('filterType');
    const filterDistance = document.getElementById('filterDistance');
    const filterCategory = document.getElementById('filterCategory');
    const dropdownContainer = document.getElementById('dropdownContainer');

    let activeFilter = null;
    let selectedType = null;
    let selectedDistance = null;
    let selectedCategory = null;

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

    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const d = date.getDate();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const min = minutes < 10 ? '0' + minutes : minutes;
        return `${day}, ${month} ${d} · ${hours}:${min} ${ampm}`;
    }

    function renderEvents(events) {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';

        if (events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-results">No events found for selected filters.</p>';
            return;
        }

        events.forEach((event, index) => {
            const isOnline = event.type === 'online';

            const card = document.createElement('div');
            card.className = 'p2-event-card';
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <div class="p2-event-img-wrapper">
                    ${isOnline ? '<span class="p2-online-badge">Online Event</span>' : ''}
                    <img src="${event.image}" alt="${event.title}" class="p2-event-card-img ${index === 4 ? 'p2-img-large' : ''}">
                </div>
                <div class="p2-event-card-info">
                    <p class="p2-card-row1">${formatDate(event.date)}</p>
                    <h3 class="p2-card-row2">${event.title}</h3>
                    <p class="p2-card-row3">${event.category}${event.distance && !isOnline ? ' (' + event.distance + ' km)' : ''}</p>
                    <div class="p2-card-row4">
                        ${event.attendees ? '<span>' + event.attendees + ' attendees</span>' : ''}
                        ${event.attendees && event.spotsLeft ? '<span class="p2-card-dot">·</span>' : ''}
                        ${event.spotsLeft ? '<span class="p2-card-row4-price">' + event.spotsLeft + ' spots left</span>' : ''}
                    </div>
                </div>
            `;

            eventsContainer.appendChild(card);
        });

        applyCardPaddings();
    }

    function applyCardPaddings() {
        const paddings = [16, 16, 16, 16, 16, 180];
        const cards = eventsContainer.querySelectorAll('.p2-event-card');
        cards.forEach((card, i) => {
            card.style.paddingBottom = paddings[i] + 'px';
            if (i < cards.length - 1) {
                card.style.borderBottom = '1px solid #d9d9d9';
            } else {
                card.style.borderBottom = 'none';
            }
        });
    }

    function filterEvents() {
        let filtered = [...eventsStore];

        if (selectedType) {
            filtered = filtered.filter(event => event.type === selectedType);
        }

        if (selectedDistance) {
            filtered = filtered.filter(event => event.distance <= selectedDistance);
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

    function openDropdown(type, options, currentValue, setter, buttonEl) {
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
        clearOption.textContent = 'Any';
        clearOption.addEventListener('click', () => {
            setter(null);
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
                closeDropdown();
                filterEvents();
            });
            dropdown.appendChild(el);
        });

        dropdownContainer.appendChild(dropdown);
    }

    filterType.addEventListener('click', () => {
        openDropdown('type', typeOptions, selectedType, (v) => { selectedType = v; }, filterType);
    });

    filterDistance.addEventListener('click', () => {
        openDropdown('distance', distanceOptions, selectedDistance, (v) => { selectedDistance = v; }, filterDistance);
    });

    filterCategory.addEventListener('click', () => {
        openDropdown('category', categoryOptions, selectedCategory, (v) => { selectedCategory = v; }, filterCategory);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-chip') && !e.target.closest('.dropdown')) {
            closeDropdown();
        }
    });

    renderEvents(eventsStore);
});