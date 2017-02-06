function project_eko_widgets(instance){
    "use strict";
    var module = instance.web_project_eko;
    var _t     = instance.web._t;
    var QWeb   = instance.web.qweb;

    module.MobileWidget = instance.web.Widget.extend({
        init: function(parent, params){
            this._super(parent, params);
            this._context = {};
        },
        start: function(){
            if(!$('#oe-mobilewidget-viewport').length){
                $('head').append('<meta id="oe-mobilewidget-viewport" name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1">');
            }
            return this._super();
        },
        destroy: function(){
            $('#oe-mobilewidget-viewport').remove();
            return this._super();
        },
        context: function(context) {
            this._context = _.extend(this._context, context);
            return new instance.web.CompoundContext(
                instance.session.user_context, this._context);
        },
    });

    module.ProjectEkoMainWidget = module.MobileWidget.extend({
        template: 'ProjectEkoMainWidget',
        init: function(parent, params){
            this._super(parent, params);
            this.projects = [];
            this.loaded = this.load();
        },
        load: function(){
            var self = this;
            return new instance.web.Model('project.project')
                .call('search_read', [ [['members','in', [self.session.uid]]] ], {context: self.context()})
                .then(function(projects){
                    self.projects = projects;
                    // @TODO Allow search projects
                });
        },
        renderElement: function(){
            this._super();
            var self = this;
            this.$('.clockpicker').clockpicker({
                placement: 'bottom',
                align: 'left',
                donetext: 'Done'
            });
            // Toggle Menu
            this.$('.js_menu').click(function(e){self.toggle_menu(e);});
            // Refresh button
            this.$('.js_refresh').click(function(e){self.refresh(e);});
            // Quit button
            this.$('.js_quit').click(function(e){self.quit(e);});
        },
        start: function(){
            this._super();
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
                self.renderElement();
            });
        },
        toggle_menu: function(e){
            $('#sidenav').css({
                display: function( index, value ) {
                    value = (value === 'none' ? 'block' : 'none');
                    $('#overlay').css("display", value);
                    return value;
                },
            });
        },
        refresh: function(e){
            var self = this;
            return this.load()
                .then(function(){
                    self.renderElement();
                });
        },
        quit: function(e){
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'open_view_project_all']], ['res_id']).then(function(res) {
                    window.location = '/web#action=' + res[0].res_id;
                });
        },
        destroy: function(){
            this._super();
            instance.webclient.set_content_full_screen(false);
        },
    });
    instance.web.client_actions.add('project.eko.main', 'instance.web_project_eko.ProjectEkoMainWidget');

}

openerp.web_project_eko = function(openerp) {
    openerp.web_project_eko = openerp.web_project_eko || {};
    project_eko_widgets(openerp);
};
