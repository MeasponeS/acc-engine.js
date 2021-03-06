import _ from 'underscore';
import Application from "../foundation/Application";

export default class Pipeline {
    /**@property {Application} _container*/
    _container = null;
    _passable = null;
    _pipes = [];
    _method = 'handle';

    /**
     * @param {Application} container
     * */
    constructor(container) {
        this._container = container;
    }

    send(passable) {
        this._passable = passable;
        return this;
    }

    through(...pipes) {
        this._pipes = _.isArray(pipes) ? pipes : Array.from(arguments);
        return this;
    }

    via(method) {
        this._method = method;
        return this;
    }

    async then(destination) {
        let pipeline = this._pipes.reverse()
            .reduce(this._carry(), this._prepareDestination(destination));
        return await pipeline(this._passable);
    }

    async thenReturn() {
        return await this.then((passable) => {
            return passable;
        });
    }

    _prepareDestination(destination) {
        return async (passable) => {
            return await destination(passable);
        }
    }

    _carry() {
        return async (stack, pipe) => {
            return async (passable) => {
                if (_.isFunction(pipe) && !this.isClass(pipe)) {
                    return await pipe(passable, stack);
                } else if (_.isString(pipe)) {
                    pipe = this._container[pipe];
                } else if (this.isClass(pipe)) {
                    pipe = new pipe();
                }
                return pipe.hasOwnProperty(this._method) ? await pipe[this._method](passable, stack) : null;
            }
        }
    }

    isClass(obj) {
        return this.container.isClass(obj);
    }

    /**
     * @return {Application}
     * */
    get container() {
        return this._container;
    }
}
