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

class RedirectTarget {
    private static instance: RedirectTarget;
    private target: string;

    private constructor() {

    }

    public static getInstance(): RedirectTarget {
        if (RedirectTarget.instance == null) {
            RedirectTarget.instance = new RedirectTarget();
        }
        return RedirectTarget.instance;
    }

    public setLink(link: string) {
        this.target = link;
    }

    public getLink() {
        return this.target;
    }


}

function getTopNews() {
    var url = 'https://newsapi.org/v2/top-headlines?' +
            'country=us&' +
            'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(async (response) => {
            const data = await response.json();
            parseArticles(data);
            
            populateNewsArticles();
        })
}

function searchNews() {
    let searchBox = document.getElementById('searchBox');
    let text = searchBox.value;

    var url = 'https://newsapi.org/v2/everything?' +
          'q='+text+'&' +
          'sortBy=popularity&' +
          'apiKey=d5a8f13f25e94786a1d4a394a097eed1';
    var req = new Request(url);
    fetch(req)
        .then(async (response) => {
            const data = await response.json();
        
            parseArticles(data);
            
            populateNewsArticles();
        })
}

function parseArticles (data) {
    let articles: Article[] = [];
    let completeArticles: number = 0;
    let i : number = 0;

    while(completeArticles < 9 && i < 20) {
        let raw = data.articles[i];
        if(articleCheck(data.articles[i])) {
            articles.push(new Article(
                raw.title.split(" - ",1)[0],
                raw.source.name,
                raw.description,
                raw.content,
                raw.urlToImage,
                raw.url
            )); 
            completeArticles++;
        }
        i++;
    }
    let articleSet: ArticleSet = ArticleSet.getInstance();
    articleSet.setData(articles);
}

function articleCheck(data): boolean {
    return (data.title && data.source.name && data.description && data.content && data.urlToImage && data.url);
}

function populateNewsArticles() {
    const topStories = document.getElementById('topStories').getElementsByClassName("col-md-4");
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();

    for (let i = 0; i < 9; i++) {
        
        topStories[i].getElementsByTagName('H3')[0].textContent = articles[i].title;
        topStories[i].getElementsByTagName('H4')[0].textContent = articles[i].site;
        topStories[i].getElementsByTagName('P')[0].textContent = articles[i].description;
        (topStories[i].getElementsByTagName('BUTTON')[0] as any).value = i;
        topStories[i].setAttribute("style", "visibility:visible;");
    }
}

function viewStory(objButton: Object) {
    let articleSet: ArticleSet = ArticleSet.getInstance();
    let articles: Article[] = articleSet.getData();
    let article = articles[(objButton as any).value];
    
    // set title (site)
    const modal = document.getElementById('storyModal');
    const titleEl = modal.querySelector('.modal-title');
    titleEl.textContent = article.site;
    
    // set text (content)
    const bodyEl = modal.querySelector('.modal-body>p');
    let content: string = article.content.split("[",1)[0];
    bodyEl.textContent = content;
    
    // show image
    const image = modal.querySelector('.modal-body>div>img');
    image.setAttribute('src',article.imageUrl);

    // link to external site
    RedirectTarget.getInstance().setLink(article.url);

}

function redirect() {
    let url: string = RedirectTarget.getInstance().getLink();
    window.open(url,'_blank');
}
window.onload = function () {

    getTopNews();
}