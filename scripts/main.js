document.addEventListener("DOMContentLoaded", () => {

    function loadComponent(id, file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(id);
                if (element) element.innerHTML = data;
            })
            .catch(error => console.error(error));
    }

    loadComponent('mesto-dlya-shapki', 'components/header.html');
    loadComponent('mesto-dlya-futera', 'components/footer.html');
});