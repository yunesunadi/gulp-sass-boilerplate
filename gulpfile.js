const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const { gifsicle, mozjpeg, optipng, svgo } = require("gulp-imagemin");
const replace = require("gulp-replace");
const clean = require("gulp-clean");
const { init, reload } = require("browser-sync").create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const htmlPath = "./*.html",
    sassPath = "./src/sass/**/*.scss",
    jsTaskHomePath = ["./src/js/home.js", "home.js"],
    jsTaskAboutPath = ["./src/js/about.js", "about.js"],
    jsWatchPath = "./src/js/**/*.js",
    imgPath = "./src/assets/images/**/*.{png,jpg,gif,svg}",
    imgCleanPath = "./dist/assets/images";

function sassDevTask() {
    return src(sassPath, { sourcemaps: true })
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./dist/css", { sourcemaps: "." }));
}

function sassProdTask() {
    return src(sassPath)
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest("./dist/css"));
}

function jsDevTask([jsTaskPath, jsSourcePath]) {
    return browserify(jsTaskPath)
        .transform(babelify, { presets: ["@babel/preset-env"] })
        .bundle()
        .pipe(source(jsSourcePath))
        .pipe(buffer())
        .pipe(dest("./dist/js"));
}

function jsDevHomeTask() {
    return jsDevTask(jsTaskHomePath);
}

function jsDevAboutTask() {
    return jsDevTask(jsTaskAboutPath);
}

function jsProdTask([jsTaskPath, jsSourcePath]) {
    return browserify(jsTaskPath)
        .transform(babelify, { presets: ["@babel/preset-env"] })
        .bundle()
        .pipe(source(jsSourcePath))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(dest("./dist/js"));
}

function jsProdHomeTask() {
    return jsProdTask(jsTaskHomePath);
}

function jsProdAboutTask() {
    return jsProdTask(jsTaskAboutPath);
}

function imgDevTask() {
    return src(imgPath).pipe(dest("./dist/assets/images"));
}

function imgProdTask() {
    return src(imgPath)
        .pipe(
            imagemin(
                [
                    gifsicle({ interlaced: true }),
                    mozjpeg({ quality: 75, progressive: true }),
                    optipng({ optimizationLevel: 5 }),
                    svgo({
                        plugins: [
                            {
                                name: "removeViewBox",
                                active: true,
                            },
                            {
                                name: "cleanupIDs",
                                active: false,
                            },
                        ],
                    }),
                ],
                {
                    verbose: true,
                }
            )
        )
        .pipe(dest("./dist/assets/images"));
}

function imgCleanTask() {
    return src(imgCleanPath, { read: false, allowEmpty: true }).pipe(
        clean({ force: true })
    );
}

function cacheBustTask() {
    const str = new Date().getTime();
    return src(htmlPath)
        .pipe(replace(/cb=\d+/g, "cb=" + str))
        .pipe(dest("./"));
}

function browserSyncTask(cb) {
    init({
        server: {
            baseDir: "./",
        },
        port: 8080,
        tunnel: "my-private-site",
        online: true,
    });
    cb();
}

function browserSyncReload(cb) {
    reload();
    cb();
}

function watchTask() {
    watch(htmlPath, series(browserSyncReload));
    watch(sassPath, series(sassDevTask, cacheBustTask));
    watch(
        jsWatchPath,
        series(parallel(jsDevHomeTask, jsDevAboutTask), cacheBustTask)
    );
    watch(imgPath, series(imgCleanTask, imgDevTask, browserSyncReload));
}

exports.default = series(
    sassDevTask,
    parallel(jsDevHomeTask, jsDevAboutTask),
    imgDevTask,
    cacheBustTask,
    browserSyncTask,
    watchTask
);

exports.build = series(
    sassProdTask,
    parallel(jsProdHomeTask, jsProdAboutTask),
    imgCleanTask,
    imgProdTask,
    cacheBustTask
);
