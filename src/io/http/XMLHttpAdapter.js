import Adapter from './Adapter';
export default class XMLHttpAdapter extends Adapter {
    #request = null;
    constructor(app) {
        super(app);
        this.#request = new XMLHttpRequest();
    }

    serialize (data) {//对发送数据的序列化
        if(!data) return '';
        let pairs=[];
        for(let name in data){
            if(!data.hasOwnProperty(name)) continue;//排除嵌套对象
            if(typeof data[name]==='function') continue;//排除操作数是函数
            let value = data[name].toString();
            name=encodeURIComponent(name);
            value=encodeURIComponent(value);
            pairs.push(name + '=' + value);
        }
        return pairs.join('&');
    }

    request (url, querys, methods) {
        this.#request.onreadystatechange = () =>  {
            if(this.#request.readyState === 4){
                if((this.#request.status >= 200 && this.#request.status < 300) || this.#request.status === 304){
                    return this.#request.responseText
                }else{
                    console.log('连接失败:' + this.#request.status);
                }
            }
        };
        url = (methods === 'get' || methods === 'delete') ? `${url}?${this.serialize(querys)}` : url;
        let sendContent = (methods === 'get' || methods === 'delete') ? null : this.serialize(querys);
        this.#request.open(methods,url,true);
        this.#request.send(sendContent);
    }

    get (url, querys = {}) {
        this.request(url, querys, 'get')
    }

    post (url, querys = {}) {
        this.request(url, querys, 'post')
    }

    put (url, querys = {}) {
        this.request(url, querys, 'put')
    }

    del (url, querys = {}) {
        this.request(url, querys, 'delete')
    }

}
