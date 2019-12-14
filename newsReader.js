var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Article = /** @class */ (function () {
    // public vars in constructor don't need to be declared :)
    function Article(title, site, description, content, imageUrl, url) {
        this.title = title;
        this.site = site;
        this.description = description;
        this.content = content;
        this.imageUrl = imageUrl;
        this.url = url;
    }
    return Article;
}());
var ArticleSet = /** @class */ (function () {
    function ArticleSet() {
    }
    ArticleSet.getInstance = function () {
        if (ArticleSet.instance == null) {
            ArticleSet.instance = new ArticleSet();
        }
        return ArticleSet.instance;
    };
    ArticleSet.prototype.setData = function (articles) {
        this.articles = articles;
    };
    ArticleSet.prototype.getData = function () {
        return this.articles;
    };
    return ArticleSet;
}());
var RedirectTarget = /** @class */ (function () {
    function RedirectTarget() {
    }
    RedirectTarget.getInstance = function () {
        if (RedirectTarget.instance == null) {
            RedirectTarget.instance = new RedirectTarget();
        }
        return RedirectTarget.instance;
    };
    RedirectTarget.prototype.setLink = function (link) {
        this.target = link;
    };
    RedirectTarget.prototype.getLink = function () {
        return this.target;
    };
    return RedirectTarget;
}());
function getTopNews() {
    var _this = this;
    var url = 'https://newsapi.org/v2/top-headlines?' +
        'country=us&' +
        'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, response.json()];
                case 1:
                    data = _a.sent();
                    parseArticles(data);
                    populateNewsArticles();
                    return [2 /*return*/];
            }
        });
    }); });
}
function searchNews() {
    var _this = this;
    var searchBox = document.getElementById('searchBox');
    var text = searchBox.value;
    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + text + '&' +
        'sortBy=popularity&' +
        'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, response.json()];
                case 1:
                    data = _a.sent();
                    parseArticles(data);
                    populateNewsArticles();
                    return [2 /*return*/];
            }
        });
    }); });
}
function parseArticles(data) {
    var articles = [];
    var completeArticles = 0;
    var i = 0;
    while (completeArticles < 9 && i < 20) {
        var raw = data.articles[i];
        if (articleCheck(data.articles[i])) {
            articles.push(new Article(raw.title.split(" - ", 1)[0], raw.source.name, raw.description, raw.content, raw.urlToImage, raw.url));
            completeArticles++;
        }
        i++;
    }
    var articleSet = ArticleSet.getInstance();
    articleSet.setData(articles);
}
function articleCheck(data) {
    return (data.title && data.source.name && data.description && data.content && data.urlToImage && data.url);
}
function populateNewsArticles() {
    var topStories = document.getElementById('topStories').getElementsByClassName("col-md-4");
    var articleSet = ArticleSet.getInstance();
    var articles = articleSet.getData();
    for (var i = 0; i < 9; i++) {
        topStories[i].getElementsByTagName('H3')[0].textContent = articles[i].title;
        topStories[i].getElementsByTagName('H4')[0].textContent = articles[i].site;
        topStories[i].getElementsByTagName('P')[0].textContent = articles[i].description;
        topStories[i].getElementsByTagName('BUTTON')[0].value = i;
        topStories[i].setAttribute("style", "visibility:visible;");
    }
}
function viewStory(objButton) {
    var articleSet = ArticleSet.getInstance();
    var articles = articleSet.getData();
    var article = articles[objButton.value];
    // set title (site)
    var modal = document.getElementById('storyModal');
    var titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = article.site;
    // set text (content)
    var bodyEl = modal.querySelector('.modal-body>p');
    var content = article.content.split("[", 1)[0];
    bodyEl.textContent = content;
    // show image
    var image = modal.querySelector('.modal-body>div>img');
    image.setAttribute('src', article.imageUrl);
    // link to external site
    RedirectTarget.getInstance().setLink(article.url);
}
function redirect() {
    var url = RedirectTarget.getInstance().getLink();
    window.open(url, '_blank');
}
window.onload = function () {
    getTopNews();
};
