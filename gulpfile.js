'use strict';
//firebase
var gulp = require('gulp'),
    args = require('yargs').argv,
    _ = require('gulp-load-plugins')({ lazy: true }),
    config = require('./gulp.config')(),
    del = require('del'),
    browserSync = require('browser-sync'),
    port = process.env.port || config.defaultPort,
    transpileDependencies = ['transpile-root', 'transpile-collation', 'transpile-evaluation', 'transpile-expressionParser',
        'transpile-limitation', 'transpile-mutation', 'transpile-projection', 'transpile-queryObjects', 'transpile-transformation'];

gulp.task('help', _.taskListing);
gulp.task('default', ['help']);

gulp.task('build-dev', ['clean-dev'], function _testTmp() {
    process.env.BABEL_ENV = 'build';
    process.env.NODE_ENV = 'build';

    var browserify = require('browserify'),
        babelify = require('babelify'),
        source = require('vinyl-source-stream'),
        buffer = require('vinyl-buffer'),
        uglify = require('gulp-uglify'),
        sourceMaps = require('gulp-sourcemaps');

    // objectSet up the browserify instance on a task basis
    var b = browserify({
        entries: './src/index.js',
        debug: true,
        // defining transforms here will avoid crashing your stream
        transform: [babelify]
    });

    return b
        .bundle()
        .pipe(source('./src/index.js'))
        .pipe(buffer())
        .pipe(sourceMaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        //.on('error', _.util.log)
        .pipe(sourceMaps.write('./'))
        .pipe(_.rename('bundle.js'))
        .pipe(gulp.dest('./dev/'));
});

gulp.task('babel-dev', ['clean-tmp'], function _babelDev() {
    process.env.BABEL_ENV = 'build';
    process.env.NODE_ENV = 'build';

    return gulp.src('./src/**/*.js')
        .pipe(_.babel())
        .pipe(gulp.dest('./tmp'));
});

gulp.task('clean-dev', function _cleanDevBuild(done) {
    log('cleaning dev bundle.js');
    clean(config.build + 'bundle.js', done);
});

gulp.task('clean-tmp', function _cleanTmp(done) {
    log('Cleaning tmp');
    clean('./tmp', done);
});

gulp.task('plato', ['strip-comments', 'generate-plato'], function _plato(done) {
    log('Cleaning: ' + _.util.colors.blue('./tmpPlato'));
    del('./tmpPlato', done);
});

gulp.task('strip-comments', function stipComments() {
    return gulp.src(config.src + '**/*.js')
        .pipe(_.stripComments())
        .pipe(gulp.dest('./tmpPlato'));
});

gulp.task('generate-plato', function _plato(done) {
    var plato = require('plato');
    plato.inspect(config.platoScripts, config.plato.report, config.plato.options, function noop(){
        done();
    });
});

gulp.task('yuidoc', ['clean-yuidoc'], function _yuidoc() {
    log('Running yuidoc documentation generator.');
    return gulp.src([config.gridJs])
        .pipe(_.yuidoc())
        .pipe(gulp.dest('./yuidoc/classes'));
});

gulp.task('clean-yuidoc', function _clean_yuidoc(done) {
    log('Cleaning yuidoc dir.');
    clean('./yuidoc/**/*.*', done);
});

gulp.task('lint', /*['plato'],*/ function _lint() {
    log('Linting source with JSCS and JSHint.');
    return gulp
        .src(config.gridJs)
        .pipe(_.if(args.verbose, _.print()))
        .pipe(_.jshint())
        .pipe(_.jscs())
        .pipe(_.jscsStylish.combineWithHintResults())
        .pipe(_.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(_.jshint.reporter('fail'));
});

gulp.task('jscs', ['lint'], function _jscs() {
    log('Linting source with JSCS and JSHint.');
    return gulp
        .src(config.gridJs)
        .pipe(_.if(args.verbose, _.print()))
        .pipe(_.jscs())
        .pipe(_.jscs.reporter('fail'));
});

gulp.task('clean', function _clean(done) {
    var deleteConfig = [].concat(config.build, config.src);
    log('Cleaning: ' + _.util.colors.blue(deleteConfig));
    del(deleteConfig, done);
});

gulp.task('clean-code', function _clean_code(done) {
    log('Cleaning code!');
    clean([config.src + 'scripts/**/*.*'], done);
});

gulp.task('optimize', ['optimize-js'], function _optimize() {
    log('Optimizing JavaScript!');
});

gulp.task('build', ['optimize'], function _build() {
    var plato = require('plato');
    plato.inspect(config.src + 'scripts/grid.js', config.plato.report, config.plato.options, function noop(){
        //done();
    });
});

gulp.task('optimize-js', ['lint', 'clean-code'], function _optimize() {
    log('Optimizing JavaScript');
    return gulp.src(config.gridJs)
        .pipe(_.plumber())
        .pipe(_.stripComments())
        .pipe(gulp.dest(config.src + 'scripts'))
        .pipe(_.closureCompiler({
            compilerPath: 'C:\\ClosureCompiler\\compiler.jar',
            fileName: 'grid.min.js',
            compilerFlags: {
                compilation_level: 'SIMPLE_OPTIMIZATIONS',
                language_in: 'ECMASCRIPT5_STRICT',
                language_out: 'ECMASCRIPT5_STRICT',
                warning_level: 'DEFAULT',
                externs: ['./closureExterns.js'],
                create_source_map: 'D:\\Repo\\personal_projects\\grid\\dist\\scripts\\grid.min.map.js'
            }
        }))
        .pipe(gulp.dest(config.src + 'scripts'));
});

gulp.task('transpile', transpileDependencies, function _transpile() {
    log('Transpiling Dev code!');
    return true;
});

gulp.task('transpile-root', function _transpileRoot() {
    return gulp.src(config.devRootJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcRootJs));
});

gulp.task('transpile-collation', function _transpileCollation() {
    return gulp.src(config.devCollationJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcCollationJs));
});

gulp.task('transpile-evaluation', function _transpileEvaluation() {
    return gulp.src(config.devEvaluationJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcEvaluationJs));
});

gulp.task('transpile-expressionParser', function _transpileExpressionParser() {
    return gulp.src(config.devExpressionParserJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcExpressionParserJs));
});

gulp.task('transpile-limitation', function _transpileLimitation() {
    return gulp.src(config.devLimitationJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcLimitationJs));
});

gulp.task('transpile-mutation', function _transpileMutation() {
    return gulp.src(config.devMutationJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcMutationJs));
});

gulp.task('transpile-projection', function _transpileProjection() {
    return gulp.src(config.devProjectionJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcProjectionJs));
});

gulp.task('transpile-queryObjects', function _transpileQueryObjects() {
    return gulp.src(config.devQueryObjectJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcQueryObjectJs));
});

gulp.task('transpile-transformation', function _transpileTransformation() {
    return gulp.src(config.devTransformationJs)
        .pipe(_.babel())
        .pipe(gulp.dest(config.srcTransformationJs));
});

gulp.task('transpile-testData', function _transpileTestData() {
    return gulp.src('./test/testData.js')
        .pipe(_.babel())
        .pipe(_.rename('es5TestData.js'))
        .pipe(gulp.dest('./test/'));
});

gulp.task('dev-server', ['styles'], function _devServer() {
    serve(true /*isDev*/);
});

gulp.task('build-server', ['optimize'], function _buildServer() {
    serve(false /*isDev*/);
});

gulp.task('test', ['set_node_env'], function _test(done) {
    startTests(true /* singleRun */, done);
});

gulp.task('set_node_env', function _env() {
    process.env.BABEL_ENV = 'dev';
    return process.env.NODE_ENV = 'dev';
});

function serve(isDev) {
    return _.nodemon({
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.routes, config.dev + 'scripts/']
    })
        .on('restart', ['lint'], function _restart(evt) {
            log('*** nodemon restarted ***');
            log('Files changed on restart:\n' + evt);
            setTimeout(function browserSyncDelayCallback() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function _start() {
            log('*** nodemon started ***');
            startBrowserSync(isDev);
        })
        .on('crash', function _crash() {
            log('*** nodemon crashed ***');
        })
        .on('exit', function _exit() {
            log('*** nodemon exited cleanly ***');
        });
}

function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active)  //gulp dev-server --nosync: prevents browser-sync from reloading on changes
        return;

    log ('Starting browser-sync on port: ' + port);
    if (isDev) {
        gulp.watch([config.less], ['styles'])
            .on('change', function _change(evt) {
                changeEvent(evt);
            });
    }
    else {
        gulp.watch([config.less, config.js], [browserSync.reload])
            .on('change', function _change(evt) {
                changeEvent(evt);
            });
    }

    browserSync({
        proxy: 'localhost:' + port + '/public/grid.html',
        port: 3030,
        files: isDev ? [
            config.dev + '**/*.*',
            config.temp + '**/*.*',
            config.routes + '**/*.*'
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scrolling: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-browser-sync',
        notify: true,
        reloadDelay: 0
    });
}

function changeEvent(evt) {
    var sourcePattern = new RegExp('/.*(?=/' + config.dev + ')/'),
        tempPattern = new RegExp('/.*(?=/' + config.temp + ')/'),
        routePattern = new RegExp('/.*(?=/' + config.routes + ')/'),
        publicPattern = new RegExp('/.*(?=/' + config.dev + ')/');
    log('File ' + evt.path.replace(sourcePattern, '') + evt.path.replace(tempPattern, '') + evt.path.replace(routePattern, '') + evt.path.replace(publicPattern, '') + ' ' + evt.type);
}

function clean(path, done) {
    log('Cleaning ' + _.util.colors.blue(path));
    del(path).then(done());
}

function startTests(singleRun, done) {
    //del('./test/report/coverage');
    var karmaServer = require('karma').Server;
    var excludedFiles = [];

    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !!singleRun,
        exclude: excludedFiles
    }, karmaCompleted).start();

    function karmaCompleted(karmaResult) {
        log('Karma Completed');
        if (karmaResult == 1)
            done('karma: test failed with result: ' + karmaResult);
        else
            done();
    }
}

function log(msg) {
    if (typeof msg === 'object') {
        Object.keys(msg).forEach(function _printMsg(m) {
            _.util.log(_.util.colors.blue(m));
        });
    }
    else _.util.log(_.util.colors.blue(msg));
}