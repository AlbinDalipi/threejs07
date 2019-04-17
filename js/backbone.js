
//OBJECTS BACKBONE
ObjectModel = Backbone.Model.extend({

    initialize : function () {

        console.log("model created");

    }});

ObjectsCollection = Backbone.Collection.extend({

    model: ObjectModel,


});

ObjectView = Backbone.View.extend({
    initialize: function(){
        this.model.bind('change', this.render.bind(this));
    },

    render: function(){

        this.$el.html("uuid : " + this.model.get("uuid") + " =====    "
            + "Name : " + this.model.get("name")  + "   =====        "
            + "Position : " + JSON.stringify(this.model.get("position")) + "   ======    "
            + "Rotation : " + JSON.stringify(this.model.get("rotation"))) ;
        this.$el.attr("data-uuid", this.model.get("uuid"));
        return this;


    }
});

ObjectsView = Backbone.View.extend({

    events: {

        'click .cube': 'onCubeClick'

    },
    onCubeClick: (event) => {
        console.log(event);
    },
    render: function(){


    }


});











//SphereBackbone

PanoramaModel = Backbone.Model.extend({

    initialize : function () {

        console.log("panorama generated");

    }});

PanoramasCollection = Backbone.Collection.extend({

    model: PanoramaModel,


});

PanoramaView = Backbone.View.extend({
    initialize: function(){

    },

    render: function(){

        this.$el.html("Name : " + this.model.get("name") +"<br>") ;
        this.$el.append("UUID : " + this.model.get("uuid")) ;
        this.$el.append("<hr>") ;
        this.$el.attr("data-uuid", this.model.get("uuid")) ;
        return this;


    }
});

PanoramasView = Backbone.View.extend({

    render: function(){



    }


});

