// Digital Citizen: A Game of Online Safety and Respect

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

        this.add.text(400, 420, text, {
            fontSize: '18px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Add a reliable click event to proceed
        const clickZone = this.add.zone(400, 300, 800, 600).setInteractive();
        clickZone.on('pointerdown', () => {
            this.scene.start('SafetyDistrict');
        });
    }
}

class SafetyDistrict extends Phaser.Scene {
    constructor() {
        super({ key: 'SafetyDistrict' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#003300'); // Placeholder for Safety District background
        this.add.text(400, 50, 'Safety District', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Add placeholders for the puzzles
        const passwordPuzzleDoor = this.add.rectangle(200, 300, 150, 200, 0x666666).setInteractive();
        this.add.text(200, 300, 'Password\nPuzzle', { align: 'center', color: '#fff' }).setOrigin(0.5);

        const chatCafeDoor = this.add.rectangle(400, 300, 150, 200, 0x666666).setInteractive();
        this.add.text(400, 300, 'Stranger\nChat Café', { align: 'center', color: '#fff' }).setOrigin(0.5);

        const popupArcadeDoor = this.add.rectangle(600, 300, 150, 200, 0x666666).setInteractive();
        this.add.text(600, 300, 'Pop-Up\nArcade', { align: 'center', color: '#fff' }).setOrigin(0.5);

        // Add click events
        passwordPuzzleDoor.on('pointerdown', () => {
            this.scene.start('PasswordPuzzle');
        });

        chatCafeDoor.on('pointerdown', () => {
            console.log('Go to Stranger Chat Café');
            // this.scene.start('ChatCafe');
        });

        popupArcadeDoor.on('pointerdown', () => {
            console.log('Go to Pop-Up Arcade');
            // this.scene.start('PopupArcade');
        });
    }
}

class PasswordPuzzle extends Phaser.Scene {
    constructor() {
        super({ key: 'PasswordPuzzle' });
    }

    init() {
        this.scenarios = [
            { character: 'Billy', context: 'Xbox', password: 'coolbilly' },
            { character: 'Maria', context: 'email', password: 'password' },
            { character: 'Jamal', context: 'favorite game', password: 'jamal123' },
            { character: 'Chloe', context: 'tablet', password: 'chloe' }
        ];
        this.currentScenario = Phaser.Utils.Array.GetRandom(this.scenarios);
    }

    create() {
        this.cameras.main.setBackgroundColor('#330033');
        this.add.text(400, 50, 'Password Puzzle', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Placeholder for a generic character
        const character = this.add.rectangle(150, 250, 100, 150, 0xcccccc);
        this.add.text(150, 175, this.currentScenario.character, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Add HTML input element, pre-filled with the weak password
        const initialPassword = this.currentScenario.password;
        const inputHTML = `<input type="text" id="password-input" value="${initialPassword}" style="width: 280px; height: 30px; font-size: 20px;">`;
        const inputElement = this.add.dom(450, 250).createFromHTML(inputHTML);
        const passwordInput = inputElement.node.querySelector('#password-input');

        // Check password button
        const checkButton = this.add.rectangle(450, 550, 150, 50, 0x00ff00).setInteractive();
        this.add.text(450, 550, 'Check', { fontSize: '24px', fill: '#000' }).setOrigin(0.5);

        const instructionText = `${this.currentScenario.character}'s ${this.currentScenario.context} password is "${this.currentScenario.password}".\nIt isn't secure enough. Help make it stronger!`;
        const feedbackText = this.add.text(400, 350, instructionText, { fontSize: '18px', fill: '#fff', align: 'center', wordWrap: { width: 600 } }).setOrigin(0.5);

        checkButton.on('pointerdown', () => {
            const passwordText = passwordInput.value;
            const isStrong = passwordText.length >= 8 && /\d/.test(passwordText) && /[!@#$%^&*()]/.test(passwordText);
            const isUnchanged = passwordText === this.currentScenario.password;

            if (isUnchanged) {
                feedbackText.setText('You need to add to the password to make it stronger!');
            } else if (isStrong) {
                feedbackText.setText('Great job! That\'s a strong password!');
                inputElement.setVisible(false);
                this.time.delayedCall(2000, () => this.scene.start('SafetyDistrict'));
            } else {
                feedbackText.setText('Try making the password longer and include numbers and symbols.');
            }
        });

        // Add a button to reset
        const resetButton = this.add.text(650, 550, 'Reset', { fontSize: '24px', fill: '#fff' }).setInteractive();
        resetButton.on('pointerdown', () => this.scene.restart());

        // Clean up the HTML element when the scene is destroyed
        this.events.on('shutdown', () => {
            inputElement.destroy();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    scene: [OpeningScene, SafetyDistrict, PasswordPuzzle]
};

const game = new Phaser.Game(config);