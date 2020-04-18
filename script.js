

const WIDTH = 1350;
const HEIGHT = 600;
const PARTICLE_SIZE = 5;
const BULLET_SIZE =3;
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
const PARTICLE_CHANGE_SPEED = 0.5;
const PARTICLE_ACCELERATION = 0.15;
const DOT_CHANGE_SIZE_SPEED = 0.1;
const DOT_CHANGE_ALPHA_SPEED = 0.07;

const PARTICLE_MIN_SPEED = 5;
const PARTICLE_MAX_SPEED = 10;

const BULLET_MIN_SPEED = 3;
const BULLET_MAX_SPEED = 7;
const BULLET_CHANGE_SIZE_SPEED = 0.05;
const BULLET_CHANGE_SPEED = 0.05;
const BULLET_ACCELERATION = 0.005;
const NUMBER_PARTILE_BULLET = 15;

class particle {
    constructor(bullet, deg)
    {
        this.bullet = bullet;
        this.ctx = this.bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * PARTICLE_MIN_SPEED + PARTICLE_MAX_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];
        //{x : 10, y: 10; alpha: 1, size: 10}
    }

    update() {

        this.speed -= PARTICLE_CHANGE_SPEED;
        if(this.speed < 0)
        {
            this.speed = 0;
        }

        //increase fall speed
        this.fallSpeed += PARTICLE_ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        //calculate position
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED)
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;

        if(this.size > 0)
            this.dots.push({
                x : this.x,
                y : this.y,
                alpha: 1,
                size: this.size,
            });

        this.dots.forEach(dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });

        if(this.dots.length == 0)
        {
            this.remove();
        }
    }

    remove()
    {
        this.bullet.particles.splice( this.bullet.particles.indexOf(this), 1 );
    }

    draw() { 
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })

        
        
    }
}

class bullet {
    constructor(fireworks) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        
        this.size = BULLET_SIZE;
        this.speed = Math.random() * BULLET_MIN_SPEED + BULLET_MAX_SPEED;
        
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2;
        this.s = HEIGHT - this.y;
        this.a = ((this.speed * this.speed)) / (2*this.s);
        //this.speed = this.s / 50;
        //location in the ground
        this.xGround = this.x;
        this.yGround = HEIGHT; 
        this.fallSpeed = this.a;

        this.color = Math.floor(Math.random() * 255) + ', ' 
                    + Math.floor(Math.random() * 255) + ', '
                    + Math.floor(Math.random() * 255);

        this.particles = [];
        this.dots = [];

        //create one particle
        let bulletDeg = Math.PI * 2 / NUMBER_PARTILE_BULLET;
        for(let i = 0; i < NUMBER_PARTILE_BULLET; i++)
        {
            
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }

    update(){

        this.speed -= this.fallSpeed;
        if(this.speed < 0)
        {
            this.speed = 0;
        }
        if(this.particles.length == 0)
            this.remove();

        if(this.yGround > this.y)
            this.yGround -= this.speed;

        this.dots.push({
            x : this.xGround,
            y : this.yGround,
            alpha: 1,
            size: this.size,
        });

        this.dots.forEach(dot => {
            dot.size -= BULLET_CHANGE_SIZE_SPEED;
            dot.alpha -= BULLET_CHANGE_SPEED;
        });

        this.dots = this.dots.filter(dot => {
            return dot.size > 0;
        });

        if(this.dots.length == 0)
        {
            this.remove();
        }

        if(this.speed == 0)
            this.particles.forEach(particle => particle.update());

    }

    remove()
    {
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }

    draw(){

        if(this.speed == 0)
        {
            this.particles.forEach(particle => particle.draw());
        }
        else{
            this.dots.forEach(dot => {
                this.ctx.fillStyle = 'rgba(' + this.color + ',' + dot.alpha + ')';
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
                this.ctx.fill();
            })
        }
        
    }
}

class fireworks{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);


        this.bullets = [];
        
        setInterval(() => {
            //create new bullet
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);

        }, 850);
        
        this.loop();
    }

    loop()
    {
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout(() => this.loop(), 10);
    }


    clearScreen(){
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    draw()
    {
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());
    }
}

var f = new fireworks();