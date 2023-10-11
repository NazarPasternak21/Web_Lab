document.addEventListener('DOMContentLoaded', () => {
    const manufacturerInput = document.getElementById('manufacturer');

    // Додайте прослуховач подій для поля "Manufacturer" для блокування введення чисел
    manufacturerInput.addEventListener('input', (event) => {
        const inputValue = event.target.value;
        // Використовуйте регулярний вираз, щоб перевірити, чи є числа в введеному тексті
        if (/[0-9]/.test(inputValue)) {
            event.target.value = inputValue.replace(/[0-9]/g, ''); // Замінюємо числа порожнім рядком
        }
    });

    const laptopList = document.getElementById('laptop-list');
    const laptopModal = document.getElementById('laptop-modal');
    const saveLaptopBtn = document.getElementById('save-laptop-btn');
    const switchButton = document.getElementById('toggle-switch');
    const myLaptopsBtn = document.getElementById('my-laptops-btn');

    let laptops = JSON.parse(localStorage.getItem('laptops')) || [];
    let originalLaptops = [...laptops];

    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const createBtn = document.getElementById('create-btn');
    const modalTitle = document.getElementById('modal-title');
    const cpuInput = document.getElementById('cpu');
    const gpuInput = document.getElementById('gpu');
    const priceInput = document.getElementById('price');
    const laptopIdInput = document.getElementById('laptop-id');
    const countElement = document.getElementById('count');

    function updateLaptopCount() {
        countElement.textContent = laptops.length;
    }

    function displayLaptops(laptopData = laptops) {
        laptopList.innerHTML = '';
        laptopData.forEach((laptop, index) => {
            const laptopItem = document.createElement('div');
            laptopItem.className = 'laptop-item';
            laptopItem.innerHTML = `
                <h3>${laptop.manufacturer}</h3>
                <p>CPU: ${laptop.cpu}</p>
                <p>GPU: ${laptop.gpu}</p>
                <p>Price: ${laptop.price}</p>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            laptopList.appendChild(laptopItem);
        });
    }

    function openLaptopModal(title) {
        modalTitle.textContent = title;
        createBtn.style.background = 'lightgray';
        laptopModal.style.display = 'block';
    }

    function closeLaptopModal() {
        laptopModal.style.display = 'none';
        document.getElementById('laptop-form').reset();
        createBtn.style.background = 'rgba(234, 232, 232)';
        laptopIdInput.value = '';
    }

    function saveLaptop() {
        const manufacturer = manufacturerInput.value;
        const cpu = cpuInput.value;
        const gpu = gpuInput.value;
        const price = parseFloat(priceInput.value);

        if (!manufacturer) {
            alert('Please enter the manufacturer.');
        } else if (!cpu) {
            alert('Please enter the CPU model.');
        } else if (!gpu) {
            alert('Please enter the GPU model.');
        } else if (isNaN(price) || price < 1) {
            alert('Please enter a valid price value greater than or equal to 1.');
        } else {
            const laptopId = laptopIdInput.value;
            const laptopData = { manufacturer, cpu, gpu, price };

            if (laptopId === '') {
                laptops.push(laptopData);
            } else {
                laptops[laptopId] = laptopData;
            }

            localStorage.setItem('laptops', JSON.stringify(laptops));
            displayLaptops();
            closeLaptopModal();
            updateLaptopCount();

            // Оновіть також originalLaptops
            originalLaptops = [...laptops];
        }
    }

    searchBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
        const filteredLaptops = originalLaptops.filter((laptop) =>
            laptop.manufacturer.toLowerCase().includes(searchInput)
        );
        displayLaptops(filteredLaptops);
    });

    clearBtn.addEventListener('click', () => {
        laptops.length = 0;
        localStorage.removeItem('laptops');
        displayLaptops();
        updateLaptopCount();

        // Оновіть також originalLaptops
        originalLaptops = [];
    });

    createBtn.addEventListener('click', () => {
        openLaptopModal('Create Laptop');
    });

    saveLaptopBtn.addEventListener('click', saveLaptop);

    laptopList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.getAttribute('data-index');
            const laptopData = laptops[index];
            openLaptopModal('Edit Laptop');
            manufacturerInput.value = laptopData.manufacturer;
            cpuInput.value = laptopData.cpu;
            gpuInput.value = laptopData.gpu;
            priceInput.value = laptopData.price;
            laptopIdInput.value = index;
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            laptops.splice(index, 1);
            localStorage.setItem('laptops', JSON.stringify(laptops));
            displayLaptops();
            updateLaptopCount();

            // Оновіть також originalLaptops
            originalLaptops = [...laptops];
        }
    });

    document.getElementById('close-modal').addEventListener('click', closeLaptopModal);

    switchButton.addEventListener('click', () => {
        switchButton.classList.toggle('switch-on');

        if (switchButton.classList.contains('switch-on')) {
            laptops.sort((a, b) => a.price - b.price);
            displayLaptops();
        } else {
            laptops = [...originalLaptops];
            displayLaptops();
        }
    });

    myLaptopsBtn.addEventListener('click', () => {
        displayLaptops();
    });

    displayLaptops();
    updateLaptopCount();
});
