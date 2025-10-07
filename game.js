class OpeningScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OpeningScene' });
    }

    preload() {
        // Later, we will load our assets here
        // this.load.image('digitalCity', 'assets/digital_city.png');
        // this.load.image('modemMax', 'assets/modem_max.png');
    }

    create() {
        // Add background
        this.cameras.main.setBackgroundColor('#000033'); // Placeholder for Digital City background

        // Add Modem Max placeholder
        this.add.rectangle(400, 200, 150, 150, 0x888888);

        // Add introductory text
        const text = `Welcome to Digital City!\n\nThe mayor, Modem Max, explains that the city has been overrun by “Glitches”—silly, sneaky creatures who twist good online habits into bad ones. Your job is to fix each district by solving puzzles, talking to eccentric characters, and making good digital choices. A “Backpack of Wisdom” keeps track of solved quests, filling with badges for Safety, Respect, Information, Balance, and Creativity.\n\nClick to continue.`;

        this.add.text(100, 350, text, {
            fontSize: '18px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5, 0).setX(400);

        // Add a click event to proceed
        this.input.on('pointerdown', () => {
            // For now, it does nothing. Later it will start the first level.
            console.log('Starting game...');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [OpeningScene] // Use the new scene
};

const game = new Phaser.Game(config);