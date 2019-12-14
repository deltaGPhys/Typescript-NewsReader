class Article {
    // public vars in constructor don't need to be declared :)
    constructor(public title: string, public site: string, public description: string, public content: string, public imageUrl: string, public url: string) {
    }
}

class ArticleSet {
    private static instance: ArticleSet;
    private articles: Article[];

    private constructor() {
    }

    public static getInstance(): ArticleSet {
        if (ArticleSet.instance == null) {
            ArticleSet.instance = new ArticleSet();
        }
        return ArticleSet.instance;
    }

    public setData(articles: Article[]) {
        this.articles = articles;
    }

    public getData() {
        return this.articles;
    }

}

interface Person {
    firstName: string;
    lastName: string;
}



function getTopNews() {
    var url = 'https://newsapi.org/v2/top-headlines?' +
            'country=us&' +
            'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(async (response) => {
            const data = await response.json();
            console.log(data.articles);
            let articles: Article[] = [];
            for (let i = 0; i < 12; i++) {
                let raw = data.articles[i];
                articles.push(new Article(
                    raw.title.split(" - ",1)[0],
                    raw.source.name,
                    raw.description,
                    raw.content,
                    raw.urlToImage,
                    raw.source.url
                ));
            }
            let articleSet: ArticleSet = ArticleSet.getInstance();
            articleSet.setData(articles);
            populateTopNewsArticles();
        })
}

function populateTopNewsArticles() {
    const topStories = document.getElementById('topStories').getElementsByClassName("col-md-4");
    console.log(topStories);
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();

    for (let i = 0; i < 12; i++) {
        
        topStories[i].getElementsByTagName('H3')[0].textContent = articles[i].title;
        topStories[i].getElementsByTagName('H4')[0].textContent = articles[i].site;
        topStories[i].getElementsByTagName('P')[0].textContent = articles[i].description;
        topStories[i].getElementsByTagName('BUTTON')[0].value = i;
        topStories[i].setAttribute("style", "visibility:visible;");
    }
}

function viewStory(objButton: Object) {
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();
    let article = articles[objButton.value];
    
    const modal = document.getElementById('storyModal');
    const titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = article.site;
    
    const bodyEl = modal.querySelector('.modal-body>p');
    let content: string = article.content.split("[",1)[0];

    bodyEl.textContent = content;

    console.log(bodyEl);
    const image = modal.querySelector('.modal-body>div>img');
    console.log(image);
    image.setAttribute('src',article.imageUrl);
}

window.onload = function () {

    getTopNews();
}