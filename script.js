(function () {
    const canvas = document.getElementById("snowCanvas");
    const ctx = canvas.getContext("2d");
    const snowfallSizeSlider = document.getElementById("snowfallSizeSlider");
    const snowfallSizeValue = document.getElementById("snowfallSizeValue");
    const lamp = document.getElementById("lamp");
    const body = document.body;

    let snowfallSize = 2.5;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = [];
    const snowflakeCount = 300;

    const snowflakeShapes = ['circle', 'triangle', 'rectangle'];

    for (let i = 0; i < snowflakeCount; i++) {
        const shape = snowflakeShapes[Math.floor(Math.random() * snowflakeShapes.length)];
        const snowflake = createSnowflake(shape);
        snowflakes.push(snowflake);
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function getBackgroundColor() {
        const seconds = Math.floor(new Date().getTime() / 2000);
        return seconds % 2 === 0 ? '#1d1f20' : '#9a031e';
    }

    function createSnowflake(shape) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * snowfallSize;
        const speed = Math.random() * 2 + 1;
        const blur = Math.random() * 5;
        const wind = Math.random() * 2 - 1;
        const rotation = Math.random() * 360;

        return {
            x,
            y,
            shape,
            color: '#ffffff',
            radius,
            speed,
            blur,
            wind,
            rotation,
        };
    }

    function handlePointerMove(event) {
        const newSnowfallSize = Math.floor(event.clientX / window.innerWidth * 5) + 1;
        if (newSnowfallSize !== snowfallSize) {
            snowfallSize = newSnowfallSize;
            snowfallSizeValue.textContent = snowfallSize.toFixed(1);

            snowflakes.forEach(snowflake => {
                snowflake.radius = Math.random() * snowfallSize + snowfallSize * 0.5;
                snowflake.wind = Math.random() * 2 - 1;
                snowflake.blur = Math.random() * 5;
                snowflake.rotation = Math.random() * 360;
            });
        }

        let lampX = event.clientX;
        let lampY = event.clientY;

        lampX = Math.max(Math.min(lampX, canvas.width - lamp.offsetWidth / 2), lamp.offsetWidth / 2);
        lampY = Math.max(Math.min(lampY, canvas.height - lamp.offsetHeight / 2), lamp.offsetHeight / 2);

        lamp.style.left = lampX + 'px';
        lamp.style.top = lampY + 'px';

        body.style.backgroundColor = getBackgroundColor();
    }

    function drawSnowflake(ctx, snowflake) {
        ctx.save();

        ctx.translate(snowflake.x, snowflake.y);
        ctx.rotate((snowflake.rotation * Math.PI) / 180);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, snowflake.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#dcdcdc');
        ctx.fillStyle = gradient;

        ctx.shadowBlur = snowflake.blur;
        ctx.shadowColor = '#ffffff';

        ctx.beginPath();

        if (snowflake.shape === 'circle') {
            ctx.arc(0, 0, snowflake.radius, 0, Math.PI * 2);
        } else if (snowflake.shape === 'triangle') {
            ctx.moveTo(0, -snowflake.radius);
            ctx.lineTo(snowflake.radius * Math.cos(Math.PI / 6), snowflake.radius / 2);
            ctx.lineTo(-snowflake.radius * Math.cos(Math.PI / 6), snowflake.radius / 2);
            ctx.closePath();
        } else if (snowflake.shape === 'rectangle') {
            const side = snowflake.radius * Math.sqrt(2);
            ctx.rect(-side / 2, -side / 2, side, side);
        }

        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    function animate() {
        requestAnimationFrame(animate);
    
        ctx.fillStyle = getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        snowflakes.forEach(snowflake => {
            drawSnowflake(ctx, snowflake);
    
            // Add melting effect
            if (snowflake.radius > 0.1) {
                snowflake.radius -= 0.01;
                snowflake.blur += 0.1;
            } else {
                // Reset the snowflake if it's too small
                snowflake.radius = Math.random() * snowfallSize + snowfallSize * 0.5;
                snowflake.blur = Math.random() * 5;
                snowflake.y = 0;
                snowflake.x = Math.random() * canvas.width;
            }
    
            snowflake.y += snowflake.speed;
            snowflake.x += snowflake.wind;
    
            if (snowflake.y > canvas.height) {
                snowflake.y = 0;
                snowflake.x = Math.random() * canvas.width;
            }
            if (snowflake.x > canvas.width) {
                snowflake.x = 0;
            } else if (snowflake.x < 0) {
                snowflake.x = canvas.width;
            }
        });
    }

    animate();
})();