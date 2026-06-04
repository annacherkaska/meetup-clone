fetch('components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('mesto-dlya-shapki').innerHTML = data;
    });