function printIntro(tag, print) {
    print.info('\n\n==========================================')
    print.info('\n')
    print.info('             ▒▒▒▒▒▓▓█')
    print.info('          █▒▒▒▒▒▒▒▒▒█')
    print.info('              ██▒▒▒▒█')
    print.info('                  █▓█')
    print.info('                    █')
    print.info('                    █')
    print.info('                    █')
    print.info('            ████████████████')
    print.info('         ████░░░░░░░█░░░░░░████')
    print.info('      ███░░░░░░░░░░░█░░░░░░░░░░░░░██')
    print.info('    ██░░░░░░░░░░░░▒▒▒▒▒░░░░░░░░░░░░░██')
    print.info('  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██')
    print.info('██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██')
    print.info('  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░██')
    print.info('            ██████░░░░░░░░░░░░░░░░░██')
    print.info('                 █████████████████')
    
    print.info('\n==========================================')
    print.info(`|         * ${tag} *         |`)
    print.info('==========================================')
}

function printLine(onNew, print) {
    if(onNew) {
        print.info('\n------------------------------------------')
    } else {
        print.info('------------------------------------------')
    }
}

function printDouble(onNew, spaceAfter, print) {
    if(onNew) {
        print.info('\n==========================================\n\n')
    } else if(spaceAfter) {
        print.info('==========================================\n\n')
    } else {
        print.info('==========================================')
    }
}

module.exports = { printIntro, printLine, printDouble }
