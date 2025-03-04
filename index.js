const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function show(flag = true) {
    const TODOS = [];
    for (let fileContent of files) {
        const lines = fileContent.split('\n');

        for (let line of lines) {
            if (line.includes('// TODO') && !(line.includes('"') || line.includes("'"))) {
                TODOS.push(line.trim());
            }
        }
    }
    if (flag) {
        for (let todo of TODOS) {
            console.log(todo);
        }
    }
    else
        return TODOS;
}

function important()
{
    let mas = show(false)
    for (let str of mas) {
        if (str.includes('!')) {
            console.log(str);
        }
    }
}

function getUser(needName)
{
    let mas = show(false)
    for (let str of mas) {
        if (!str.includes(';')) {
            continue;
        }
        let name = str.split(' ')[2].slice(0, -1);
        if (name.toLowerCase() === needName.toLowerCase()) {
            console.log(str);
        }
    }

}


function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            show();
            break;
        case command === 'important':
            important();
            break;
        case command.startsWith('user'):
            getUser(command.slice(command.indexOf('{') + 1,
                command.indexOf('}')));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
