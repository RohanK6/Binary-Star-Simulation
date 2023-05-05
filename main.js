/** HTML Related (the sliders for the mass of the stars) */
const star1MassSlider = document.getElementById("star1Mass");
const star2MassSlider = document.getElementById("star2Mass");
const eccentricitySlider = document.getElementById("eccentricity");
const star1LuminositySlider = document.getElementById("star1Luminosity");
const star2LuminositySlider = document.getElementById("star2Luminosity");

const star1MassText = document.getElementById("star1MassText");
const star2MassText = document.getElementById("star2MassText");
const eccentricityText = document.getElementById("eccentricityText");
const star1LuminosityText = document.getElementById("star1LuminosityText");
const star2LuminosityText = document.getElementById("star2LuminosityText");

let star1Mass = 10;
let star2Mass = 10;
let eccentricity = 0.5;
let star1Luminosity = 10;
let star2Luminosity = 10;
let semiMajorAxis = 200;
const numOfRecordedPaths = 200;
const star1Color = "orange";
const star2Color = "cyan";

star1MassSlider.oninput = function() {
    star1MassText.innerHTML = `Mass of Star 1: ${this.value}`;
    star1Mass = parseInt(this.value);
    modifyStars();
}

star2MassSlider.oninput = function() {
    star2MassText.innerHTML = `Mass of Star 2: ${this.value}`;
    star2Mass = parseInt(this.value);
    modifyStars();
}

eccentricitySlider.oninput = function() {
    eccentricityText.innerHTML = `Eccentricity: ${this.value}`;
    eccentricity = parseFloat(this.value);
    modifyStars();
}

star1LuminositySlider.oninput = function() {
    star1LuminosityText.innerHTML = `Luminosity of Star 1: ${this.value}`;
    star1Luminosity = parseInt(this.value);
    modifyStars();
}

star2LuminositySlider.oninput = function() {
    star2LuminosityText.innerHTML = `Luminosity of Star 2: ${this.value}`;
    star2Luminosity = parseInt(this.value);
    modifyStars();
}

let luminosityChart = getBaseLuminosityChart();

function setup() {
    const canvas = createCanvas(800, 800);
    canvas.parent("canvas");
    background(20);

    star1 = new Star(star1Mass, semiMajorAxis, eccentricity, 0, star1Color, star1Luminosity);
    star2 = new Star(star2Mass, semiMajorAxis, eccentricity, PI, star2Color, star2Luminosity);

    addFirstYZeroPointToChart();
}

function addFirstYZeroPointToChart() {
    luminosityChart.data.labels.push(0);
    luminosityChart.data.datasets[0].data.push(0);
    luminosityChart.update();
}


let star1;
let star2;
let star3;
let time = 0;
let dt = 0.01;

function modifyStars() {

    // recreate the chart 
    luminosityChart.destroy();
    luminosityChart = getBaseLuminosityChart();

    addFirstYZeroPointToChart();

    let semiMajorAxisStar1;
    let semiMajorAxisStar2;

    if (star1Mass > star2Mass) {
        semiMajorAxisStar1 = semiMajorAxis * star2Mass / star1Mass;
        semiMajorAxisStar2 = semiMajorAxis;
    } else if (star1Mass <= star2Mass) {
        semiMajorAxisStar1 = semiMajorAxis;
        semiMajorAxisStar2 = semiMajorAxis * star1Mass / star2Mass;
    } else {
        semiMajorAxisStar1 = semiMajorAxis;
        semiMajorAxisStar2 = semiMajorAxis;
    }

    star1 = new Star(star1Mass, semiMajorAxisStar1, eccentricity, 0, star1Color, star1Luminosity);
    star2 = new Star(star2Mass, semiMajorAxisStar2, eccentricity, PI, star2Color, star2Luminosity);
}

let systemLuminosity = 0;
let systemLuminosityOverTime = [];
let isEclipsing = false;

let graphX = 900;
let graphY = 350;
let graphWidth = 700;
let graphHeight = 200;

function draw() {
    background(20);

    star1.update(time);
    star2.update(time);

    // If the eclipse is no longer happening, reset the system luminosity
    if (!isEclipsing) {
        systemLuminosity = star1.luminosity + star2.luminosity;
    }

    star1.drawPath();
    star2.drawPath();

    star1.draw();
    star2.draw();

    stroke(255);
    strokeWeight(2);
    line(width/2.-5, height/2., width/2.+5, height/2.);
    line(width/2., height/2.-5, width/2., height/2.+5);

    const star1XPosition = abs(star1.position.x);
    const star2XPosition = abs(star2.position.x);

    isEclipsing = star1XPosition < 20 && star2XPosition < 20;

    if (isEclipsing) {
        handleEclipse();
    }

    systemLuminosityOverTime.push(systemLuminosity);

    luminosityChart.data.labels.push(time.toFixed(1));
    luminosityChart.data.datasets[0].data.push(systemLuminosity);

    // If there are 30 entries in the chart, remove the 2nd element (always keep the first one)
    if (luminosityChart.data.labels.length > numOfRecordedPaths*1.5) {
        luminosityChart.data.labels.splice(1, 1);
        luminosityChart.data.datasets[0].data.splice(1, 1);
    }

    luminosityChart.update();

    time = time + dt;
}

function handleEclipse() {
    // Track the visible luminosity of the system
    const star1YPosition = star1.position.y;
    const star2YPosition = star2.position.y;

    // Star 1 is at the 'top' of the eclipse and is being eclisped (blocked) by star 2
    if (star1YPosition < star2YPosition) {
        let percentOfStar1Visible = (star1Mass - star2Mass) / star1Mass;
        if (percentOfStar1Visible < 0) {
            percentOfStar1Visible = 0;
        }
        const star1Luminosity = star1.luminosity * percentOfStar1Visible;
        const star2Luminosity = star2.luminosity;
        systemLuminosity = star1Luminosity + star2Luminosity;
    }
    // Star 2 is at the 'top' of the eclipse and is being eclisped (blocked) by star 1
    else if (star1YPosition > star2YPosition) {
        let percentOfStar2Visible = (star2Mass - star1Mass) / star2Mass;
        if (percentOfStar2Visible < 0) {
            percentOfStar2Visible = 0;
        }
        const star1Luminosity = star1.luminosity;
        const star2Luminosity = star2.luminosity * percentOfStar2Visible;
        systemLuminosity = star1Luminosity + star2Luminosity;
    }

}

function stop() {
    noLoop();
}
  
function start() {
    loop();
}

function getBaseLuminosityChart() {
    return new Chart('luminosity-chart', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'System Luminosity',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Luminosity'
                    }
                }
            }
        }
    });
}