import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);
const server = browserSync.create();

// Путь к файлам
const paths = {
    styles: {
        src: 'src/sass/**/*.scss',
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**/*',
        dest: 'dist/img'
    },
    html: {
        src: 'src/*.html'
    }
};

// Компиляция Sass в CSS, добавление префиксов и минификация
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.stream());
}

// Минификация JavaScript
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(server.stream());
}

// Оптимизация изображений
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

// Копирование HTML файлов
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest('dist'))
        .pipe(server.stream());
}

// Наблюдение за изменениями файлов и перезагрузка браузера
function watch() {
    server.init({
        server: {
            baseDir: './src'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.html.src, html).on('change', server.reload);
}

// Экспорт задач для вызова через командную строку
export { styles, scripts, images, html, watch };
export default gulp.series(styles, scripts, images, html, watch);