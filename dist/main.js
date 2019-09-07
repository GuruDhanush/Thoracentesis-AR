var bp = document.getElementById('bp');
    var hr = document.getElementById('hr');
    var spo2 = document.getElementById('spo2');

    function updateHR() {
        setInterval(() => {
            var current = hr.innerText;
            var diff = Math.random();
            if (diff > 0.5) current--;
            else current++;

            if (current < 50 || current > 150) current = 60;

            hr.innerText = current;
        }, 1000);
    }

    function updateBP() {
        setInterval(() => {
            var total = bp.innerText.split('/');
            var systole = total[0];
            var diastole = total[1];
            var diff = Math.random();
            if (diff > 0.5) systole--;
            else systole++;
            var diff = Math.random();
            if (diff > 0.5) diastole--;
            else diastole++;
            bp.innerText = systole + '/' + diastole;
        }, 3000);
    }

    function updateSPo2() {
        setInterval(() => {
            var current = spo2.innerText;
            var diff = Math.random();
            if (diff > 0.5) current--;
            else current++;

            if (current > 100 || current < 90) current = 100;
            spo2.innerText = current;
        }, 1000);
    }

    updateBP();
    updateHR();
    updateSPo2();




    var model = document.getElementById('model');
    var modeSwitch = document.getElementById('mode-switch');

    modeSwitch.addEventListener('change', function () {
        if (this.checked)
            model.setAttribute('gltf-model', '../models/lungdraco.gltf');
        else
            model.setAttribute('gltf-model', '../models/bonedraco.gltf');
    });

    var looker = document.getElementById('marker');

    AFRAME.registerComponent('registerevents', {
        init: function () {
            var marker = this.el;
            marker.addEventListener('markerFound', function () {
                var markerId = marker.id;
                looker.style.display = 'none';
            });
            marker.addEventListener('markerLost', function () {
                var markerId = marker.id;
                looker.style.display = 'block';

            });
        }
    });

