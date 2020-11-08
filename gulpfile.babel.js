import gulp from 'gulp';
import gulpPug from 'gulp-pug';
import gulpUglify from 'gulp-uglify';
import del from 'del';
import webpack from 'webpack-stream';

const conf = {
    pug: {
        src: ["client/src/template/*.pug"],
        dest: "client/public/template",
    },
    js: [
        {
            src: ["client/src/js/features/login.js"],
            dest: "client/public/js",
            filename: "login.min.js",
        },
        {
            src: ["client/src/js/features/index.js"],
            dest: "client/public/js",
            filename: "index.min.js",
        },
        {
            src: ["client/src/js/features/user.js"],
            dest: "client/public/js",
            filename: "user.min.js",
        },
        {
            src: ["client/src/js/features/admin.js"],
            dest: "client/public/js",
            filename: "admin.min.js",
        },
    ],
    copy: [
        {
            src: "client/src/js/lib/**",
            dest: "client/public/js/lib"
        },
        {
            src: "client/src/css/*.min.css",
            dest: "client/public/css"
        }
    ]
};

function cleanTask() {
    return () => del(['client/public/css', 'client/public/js', 'client/public/template']);
}

function pugTask() {
    return gulp.src(conf.pug.src)
        .pipe(gulpPug())
        .pipe(gulp.dest(conf.pug.dest))
}

function scriptTask() {
    let tasks = conf.js.map((conf) => () => {
        return gulp.src(conf.src)
            .pipe(webpack({
                output: {
                    filename: conf.filename,
                },
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                        },
                    ],
                },
                devtool: "source-map",
                externals: {
                    jquery: 'jQuery',
                },
                mode: "development",
            }))
            //.pipe(gulpUglify())
            .pipe(gulp.dest(conf.dest));
    });
    return gulp.parallel(...tasks);
}

function copyTask() {
    let tasks = conf.copy.map((conf) => () => {
        return gulp.src(conf.src).pipe(gulp.dest(conf.dest));
    });
    return gulp.parallel(...tasks);
}

function buildTask() {
    return gulp.series(
        cleanTask(),
        gulp.parallel(
            pugTask,
            scriptTask(),
            copyTask(),
        ),
    );
}

export const pug = gulp.parallel(pugTask);
export const build = buildTask();