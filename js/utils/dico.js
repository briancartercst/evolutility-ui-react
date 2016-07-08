
import _ from 'underscore'

var fts = {
    text: 'text',
    textml: 'textmultiline',
    bool: 'boolean',
    int: 'integer',
    dec: 'decimal',
    money: 'money',
    date: 'date',
    datetime: 'datetime',
    time: 'time',
    lov: 'lov',
    list: 'list', // many values for one field (behave like tags - return an array of strings)
    html: 'html',
    formula:'formula', // soon to be a field attribute rather than a field type
    email: 'email',
    pix: 'image',
    //geoloc: 'geolocation',
    //doc:'document',
    url: 'url',
    color: 'color',
    hidden: 'hidden',
    json: 'json'
    //rating: 'rating',
    //widget: 'widget'
};

var fieldIsNumber= function(f){
		return [fts.int, fts.dec, fts.money].indexOf(f.type)>-1;
	},

    fieldInCharts= function (f) {
        return (_.isUndefined(f.inCharts) || f.inCharts) && fieldChartable(f);
    },
    fieldChartable= function (f) { 
        return  f.type===fts.lov || f.type===fts.list || 
        			f.type===fts.bool || fieldIsNumber(f);
    };

function hById(arr){
	var objH={};
	_.forEach(arr, function(o){
		objH[o.id] = o; 
	});
	return objH;
}

function getFields(uiModel) {
	var fs = [];

	function collectFields(te) {
		if (te && te.elements && te.elements.length > 0) {
			te.elements.forEach(function(te) {
				if (te.type != 'panel-list') {
					collectFields(te);
				}
			});
		} else { 
			if(te.type && te.type!== 'formula'){
				fs.push(te);
			}
		}
	}

	if(uiModel.fields){
		return uiModel.fields;
	}else{
		collectFields(uiModel);
		uiModel.fields=fs;
		return fs;
	}
}

module.exports = {  

	fieldTypes: fts,

	getFields: getFields,

	getSubCollecs: function(uiModel) {
		var ls = {};

		function collectCollecs(te) {
			if (te.type === 'panel-list') {
				ls[te.attribute] = te;
			} else if (te.type !== 'panel' && te.elements && te.elements.length > 0) {
				_.each(te.elements, function(te) {
					if (te.type === 'panel-list') {
						ls[te.attribute] = te;
					} else if (te.type !== 'panel') {
						collectCollecs(te);
					}
				});
			} else {
				ls[te.attribute] = te;
			}
		}

		collectCollecs(uiModel);
		return ls;
	},

	prepareModel: function(m){
		if(!m.fields){
			m.fields = getFields(m);
		}
		if(!m.fieldsH){
			m.fieldsH = hById(m.fields);
		}
	},

    isFieldMany:function(f){
        return f.inList || f.inMany
    },

	fieldIsText: function(f){
		return [fts.text, fts.textml, fts.url, fts.html, fts.email].indexOf(f.type)>-1;
	},

	fieldIsNumber: fieldIsNumber,

    fieldInCharts: fieldInCharts,
    fieldChartable: fieldChartable,

	hById: hById
    
}