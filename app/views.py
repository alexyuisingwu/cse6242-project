import os
from flask import render_template, request, url_for

from app import app

from .data_analysis.analysis import analyze_external_script


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        script_file = request.files['script']
        script_title = script_file.filename.split('.')[0]
        path = os.path.join(app.root_path, 'static/tmp/{}.csv'.format(script_title))
        with open(path, 'wb') as out_file:
            analyze_external_script(script_file=script_file, output_file=out_file)
        return url_for('static', filename='tmp/{}.csv'.format(script_title))
    return render_template('stacked.html')
