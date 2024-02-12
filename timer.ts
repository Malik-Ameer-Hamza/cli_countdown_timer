#!usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import showBanner from "node-banner";

// Function to create a delay
let delay = (time = 2000) => new Promise((r) => setTimeout(r, time));


// Function to display banner
let displayBanner = async (): Promise<void> => {
    await showBanner(
        "COUNTDOWN  TIMER",
        "You can set your count down timer according to the instructions below."
    );
};


// Function to display instructions
let instructions = (): void => {
    console.log(`\n`)
    console.log(chalk.bgBlue.bold.whiteBright(`                             Instructions                                  `));
    console.log(chalk.blueBright(`--------------------------------------------------------------------------`))
    console.log(`${chalk.blueBright('=>')} Date Format: ${chalk.bgRgb(56, 56, 56).blueBright(' MM/DD/YYYY [Year Limit 2023-2025] ')} Example: ${chalk.bgRgb(56, 56, 56).blueBright(' 1/25/2024 ')}.`)
    console.log(chalk.blueBright(`--------------------------------------------------------------------------`))
    console.log(`${chalk.blueBright('=>')} Time Format: ${chalk.bgRgb(56, 56, 56).blueBright(' Hours[0-12]:Minutes[0-59] PM/AM ')} Example: ${chalk.bgRgb(56, 56, 56).blueBright(' 11:30 AM ')}.`)
    console.log(chalk.blueBright(`--------------------------------------------------------------------------`))
    console.log(`${chalk.blueBright('=>')} Timer Will Be Expired If Time Is Ended.`)
    console.log(chalk.blueBright(`--------------------------------------------------------------------------`))
    console.log(`${chalk.blueBright('=>')} Press ${chalk.bgRgb(56, 56, 56).blueBright(' Ctrl + C ')} To Stop Timer.`)
    console.log(chalk.blueBright(`--------------------------------------------------------------------------\n`))
}


// Function to prompt the user for date and time
let setTimeDate = async (): Promise<{ getTime: number, getDate: number }> => {
    let getTime;
    let getDate;

    let dateRegex = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/](202[3-5])$/
    let timeRegx = /^(0?[0-9]|[1][012]):(0?[0-9]|[1-5][0-9]) ((a|p)m|(A|P)M)$/

    while (true) {
        let { userDate } = await inquirer.prompt([{
            name: "userDate",
            type: "input",
            message: "Enter Date : ",
            default: '1/25/2025'
        }]);

        getDate = await userDate;

        if (dateRegex.test(getDate)) {
            break;
        } else {
            console.log(chalk.redBright(`Enter Correct Pattern Of Date: `))
        }
    };

    while (true) {
        let { userTime } = await inquirer.prompt([{
            name: "userTime",
            type: "input",
            message: "Enter Time : ",
            default: '12:00 AM'
        }]);

        getTime = await userTime;

        if (timeRegx.test(getTime)) {
            break;
        } else {
            console.log(chalk.redBright(`Enter Correct Pattern Of Time: `))
        }
    };

    return { getTime, getDate };
}


// Function to start the timer
let startTimer = async (completeDate: string) => {
    console.log(chalk.whiteBright(`\n=======================================================`));
    console.log(chalk.bgRgb(128, 94, 1).whiteBright(` Days | Hours | Minutes | Seconds `));



    let timer = setInterval(() => {

        let newDate = (new Date() as unknown) as number;
        let myDate = (new Date(completeDate) as unknown) as number;
        let time_mili_second = myDate - newDate;

        let sec_conversion = 1000; // Millisecond in a second
        let min_conversion = sec_conversion * 60;
        let hour_conversion = min_conversion * 60;
        let day_conversion = hour_conversion * 24;

        let days = Math.floor(time_mili_second / day_conversion); // No. of days
        let hours = Math.floor((time_mili_second % day_conversion) / hour_conversion); // NO. of hours
        let minutes = Math.floor((time_mili_second % hour_conversion) / min_conversion); // Total minutes
        let seconds = Math.floor((time_mili_second % min_conversion) / sec_conversion); // total seconds

        if (time_mili_second < 0) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            console.log(chalk.redBright(`Expired`));
            console.log(chalk.whiteBright(`=======================================================\n`));
            clearInterval(timer);
            return
        }

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(` ${days > 9 ? `${days}` : `0${days}`}  :  ${hours > 9 ? `${hours}` : `0${hours}`}   :   ${minutes > 9 ? `${minutes}` : `0${minutes}`}    :   ${seconds > 9 ? `${seconds}` : `0${seconds}`}`);

    }, 1000);

}

// Main program execution
(async () => {
    await displayBanner();
    await delay(1000);

    instructions();

    let { getTime, getDate } = await setTimeDate();
    let completeDate = `${getDate} ${getTime}`
    let spinner = createSpinner("Starting Timer").start();
    await delay();
    spinner.success({ text: `Timer Started Successfully` });

    await startTimer(completeDate)


})();