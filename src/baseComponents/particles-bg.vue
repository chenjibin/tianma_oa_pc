<template>
    <div id="indexLizi"></div>
</template>
<style>

</style>
<script>
    import THREE from '@/libs/three';
    export default {
        name: 'particleBg',
        data() {
            return {};
        },
        methods: {
            liziInit () {
                let SCREEN_WIDTH = window.innerWidth;
                let SCREEN_HEIGHT = window.innerHeight;
                let SEPARATION = 90;
                let AMOUNTX = 50;
                let AMOUNTY = 50;
                let container;
                let particles, particle;
                let count;
                let camera;
                let scene;
                let renderer;
                let mouseX = 0;
                let mouseY = 0;
                let windowHalfX = window.innerWidth / 2;
                let windowHalfY = window.innerHeight / 2;
                init();
                this.interval = setInterval(loop, 1000 / 60);
                function init() {
                    container = document.createElement('div');
                    container.style.position = 'relative';
                    container.style.top = '200px';
                    document.getElementById('indexLizi').appendChild(container);
                    camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
                    camera.position.z = 1000;
                    scene = new THREE.Scene();
                    renderer = new THREE.CanvasRenderer();
                    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
                    particles = [];
                    let i = 0;
                    let material = new THREE.ParticleCircleMaterial(0x097bdb, 1);
                    for (let ix = 0; ix < AMOUNTX; ix++) {
                        for (let iy = 0; iy < AMOUNTY; iy++) {
                            particle = particles[i++] = new THREE.Particle(material);
                            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                            scene.add(particle);
                        }
                    }
                    count = 0;
                    container.appendChild(renderer.domElement);
                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                    document.addEventListener('touchmove', onDocumentTouchMove, false);
                }
                function onDocumentMouseMove(event) {
                    mouseX = event.clientX - windowHalfX;
                    mouseY = event.clientY - windowHalfY;
                }
                function onDocumentTouchMove(event) {
                    if (event.touches.length === 1) {
                        event.preventDefault();
                        mouseX = event.touches[ 0 ].pageX - windowHalfX;
                        mouseY = event.touches[ 0 ].pageY - windowHalfY;
                    }
                }
                function loop() {
                    camera.position.x += (mouseX - camera.position.x) * 0.05;
                    camera.position.y = 364;
                    let i = 0;
                    for (let ix = 0; ix < AMOUNTX; ix++) {
                        for (let iy = 0; iy < AMOUNTY; iy++) {
                            particle = particles[ i++ ];
                            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
                        }
                    }
                    renderer.render(scene, camera);
                    count += 0.1;
                }
            }
        },
        mounted () {
            this.liziInit();
        },
        beforeDestroy () {
            if (this.interval) clearInterval(this.interval);
        }
    };
</script>
