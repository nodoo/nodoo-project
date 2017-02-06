# -*- coding: utf-8 -*-
# See README file on addon root folder for license details

from openerp import http
from openerp.http import request

class WebProject(http.Controller):

    @http.route(['/project/eko'], type='http', auth='user')
    def a(self, debug=False, **k):
        if not request.session.uid:
            return http.local_redirect('/web/login?redirect=/project/eko')

        return request.render('web_project_eko.project_index')
