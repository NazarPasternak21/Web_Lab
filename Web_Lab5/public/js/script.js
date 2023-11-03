document.addEventListener('DOMContentLoaded', () => {
    const manufacturerInput = document.getElementById('manufacturer');
    const laptopList = document.getElementById('laptop-list');
    const laptopModal = document.getElementById('laptop-modal');
    const saveLaptopBtn = document.getElementById('save-laptop-btn');
    const myLaptopsBtn = document.getElementById('my-laptops-btn');
    const countElement = document.getElementById('count');

    let laptops = [];
    let originalLaptops = [];

    const modalTitle = document.getElementById('modal-title');
    const cpuInput = document.getElementById('cpu');
    const gpuInput = document.getElementById('gpu');
    const priceInput = document.getElementById('price');
    const laptopIdInput = document.getElementById('laptop-id');
    const createBtn = document.getElementById('create-btn');

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
        laptopModal.style.display = 'block';
    }

    function closeLaptopModal() {
        laptopModal.style.display = 'none';
        document.getElementById('laptop-form').reset();
        laptopIdInput.value = '';
    }

    function saveLaptop() {
        const manufacturer = manufacturerInput.value.trim();
        const cpu = cpuInput.value.trim();
        const gpu = gpuInput.value.trim();
        const price = parseFloat(priceInput.value);
    
        if (!manufacturer || !cpu || !gpu || isNaN(price) || price < 1) {
            alert('Please enter all fields correctly.');
            return;
        }
    
        const laptopId = laptopIdInput.value;
        const laptopData = { manufacturer, cpu, gpu, price };
    
        if (laptopId === '') {
            const serverUrl = 'http://localhost:3000/laptops';
            fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(laptopData)
            })  
            .then((response) => response.json())
            .then((responseData) => {
                laptops.push(responseData); 
                console.log('POST request was successful:', responseData);
            })
            .catch((error) => {
                console.error('Error sending POST request:', error);
                alert('Error sending POST request. Please try again.');
            });
        } else {
            const serverUrl = `http://localhost:3000/laptops/${laptopId}`;
            fetch(serverUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(laptopData)
            })
            .then((response) => response.json())
            .then((responseData) => {
                const index = laptops.findIndex(laptop => laptop.id === responseData.id);
                if (index !== -1) {
                    laptops[index] = responseData;
                }
                console.log('PUT request was successful:', responseData);
            })
            .catch((error) => {
                console.error('Error sending PUT request:', error);
                alert('Error sending PUT request. Please try again.');
            });
        }
    
        displayLaptops();
        closeLaptopModal();
        updateLaptopCount();
    }
    

    createBtn.addEventListener('click', () => {
        openLaptopModal('Create Laptop');
    });

    saveLaptopBtn.addEventListener('click', saveLaptop);

    function updateLaptop(laptopId, updatedLaptopData) {
        const serverUrl = `http://localhost:3000/laptops/${laptopId}`;

        fetch(serverUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedLaptopData)
        })
        .then((response) => response.json())
        .then((responseData) => {
            const index = laptops.findIndex(laptop => laptop.id === responseData.id);
            if (index !== -1) {
                laptops[index] = responseData;
                displayLaptops();
                updateLaptopCount();
                closeLaptopModal();
            } else {
                console.error('Laptop not found in the array after update');
                alert('Error updating laptop. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error sending PUT request:', error);
            alert('Error sending PUT request. Please try again.');
        });
    }

    laptopList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.getAttribute('data-index');
            const laptopData = laptops[index];
            openLaptopModal('Edit Laptop');
            manufacturerInput.value = laptopData.manufacturer;
            cpuInput.value = laptopData.cpu;
            gpuInput.value = laptopData.gpu;
            priceInput.value = laptopData.price;
            laptopIdInput.value = laptopData.id;
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            const laptopData = laptops[index];
            const laptopId = laptopData.id;

            if (laptopId) {
                const serverUrl = `http://localhost:3000/laptops/${laptopId}`;

                fetch(serverUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then((response) => {
                    if (response.ok) {
                        laptops.splice(index, 1);
                        displayLaptops();
                        updateLaptopCount();
                    } else {
                        console.error('Error deleting laptop:', response.status);
                        alert('Error deleting laptop. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error sending DELETE request:', error);
                    alert('Error sending DELETE request. Please try again.');
                });
            } else {
                alert('Laptop ID is missing. Cannot delete the laptop.');
            }
        }
    });

    fetch('/laptops')
        .then((response) => response.json())
        .then((data) => {
            laptops = data;
            originalLaptops = [...laptops];
            displayLaptops();
            updateLaptopCount();
        })
        .catch((error) => {
            console.error('Error loading laptops:', error);
            alert('Error loading laptops. Please try again.');
        });
});
