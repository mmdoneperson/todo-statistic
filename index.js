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

function countExclamationMarks(str) {
    return (str.match(/!/g) || []).length;
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

function sort(command)
{
    switch (command) {
        case "important":
            sortImportance();
            break;
        case "user":
            groupTodosByUser(show(false));
            break;
        case "date":
            sortTodosByDate(show(false))
            break;

    }
}

function parseDate(dateStr) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.getTime();
}

function sortTodosByDate(todos) {
    let res = todos.sort((a, b) => {
        const dateA = parseDate(a.split(";")[1]);
        const dateB = parseDate(b.split(";")[1]);

        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
    });
    for (let j of res) {
        console.log(j);
    }
}

function groupTodosByUser(todos) {
    const grouped = {};
    for (const todo of todos) {
        const parts = todo.split(";");
        const user = parts[0].replace("// TODO", "").trim().toLowerCase();
        const task = parts.slice(1).join(";").trim();

        let key = user;
        if (!todo.includes(';'))
            key = "NO NAME"
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(todo);
    }

    printGroupedTodos(grouped);
}

function printGroupedTodos(grouped) {
    for (const [user, tasks] of Object.entries(grouped)) {
        if (user !== "Anonymous") {
            console.log(`User: ${user}`);
            for (const task of tasks) {
                console.log(`  - ${task}`);
            }
        }
    }
    if (grouped["Anonymous"]) {
        console.log("Anonymous:");
        for (const task of grouped["Anonymous"]) {
            console.log(`  - ${task}`);
        }
    }
}

function sortImportance(){
    let mas = show(false)
    mas.sort((a, b) => {
        const countA = countExclamationMarks(a);
        const countB = countExclamationMarks(b);
        return countB - countA;
    });
    for (let j of mas) {
        console.log(j);
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
            getUser(command.split(' ')[1]);
            break;
        case command.startsWith('sort'):
            sort(command.split(' ')[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
