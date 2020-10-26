(function (window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;

    function RemoteDataStore(url) {
        if (!url) {
            throw new Error('No remote URL supplied.');
        }
        
        this.serverUrl = url;
    }
/*
    RemoteDataStore.prototype.add = function (key, val) {
        return $.post(this.serverUrl, val, function (serverResponse) {
            console.log(serverResponse);
        });
    };
*/

    RemoteDataStore.prototype.add = function(data) {
        var collection = firebase.firestore().collection('coffeeorders');
        return collection.add(data);
      };

/*
    RemoteDataStore.prototype.getAll = function (cb) {
        return $.get(this.serverUrl, function (serverResponse) {
            if (cb) {
                console.log(serverResponse);
                cb(serverResponse);
            }
        });
    };
*/

RemoteDataStore.prototype.getAll = function(renderer) {
        var query = firebase.firestore()
            .collection('cofeeorders')
            .orderBy('coffee')
            .limit(50);
    
        this.getDocumentsInQuery(query, renderer);
    };

/*
    RemoteDataStore.prototype.get = function (key, cb) {
        return $.get(this.serverUrl + '/' + key, function (serverResponse) {
            if (cb) {
                console.log(serverResponse);
                cb(serverResponse);
            }
        });
    };
*/
    RemoteDataStore.prototype.get = function(query, renderer) {
        query.onSnapshot(function(snapshot) {
        if (!snapshot.size) return renderer.empty(); // Display "There are no restaurants".
    
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'removed') {
            renderer.remove(change.doc);
            } else {
            renderer.display(change.doc);
            }
        });
        });
    };

    RemoteDataStore.prototype.remove = function (key) {
        return $.ajax(this.serverUrl + '/' + key, {
            type: 'DELETE'
        });
    };

    App.RemoteDataStore = RemoteDataStore;
    window.App = App;

})(window);