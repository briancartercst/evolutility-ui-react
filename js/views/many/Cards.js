
// React-Evolutility :: /views/many/Cards.js

// Cards view to display a collection as a set of Cards.

// https://github.com/evoluteur/react-evolutility
// (c) 2016 Olivier Giulieri

import React from 'react'

import {i18n_errors} from '../../utils/i18n-en'
import Alert from '../../widgets/Alert'
import dico from '../../utils/dico'
import many from './many'
import Card from '../One/Card'
import Pagination from '../../widgets/Pagination'


export default React.createClass({

	viewId: 'cards',

	propTypes: {
		params: React.PropTypes.object
	},

	mixins: [many()],

	render() {
	    const entity = this.props.params.entity,
			m = this.model,
			data = this.state.data ? this.state.data : [],
			full_count = this.pageSummary(data),
			fullCount = data.length ? (data[0]._full_count || 0) : 0,
			title = m.title || m.label
	  		
	  	if(m){
	  		const title = m.title || m.label
			if(!this.state.error){
		  		const fieldCols = m.fields.filter(dico.isFieldMany)
			    return (
					<div data-entity={entity} className="evol-many-cards">
						
						<h2 className="evo-page-title">
							{title}
							<span className="evo-badge">{full_count}</span>
						</h2>

						<div className="evol-cards-body">
							{this.state.data.map(function(d, idx){
								return <Card key={idx} data={d} fields={fieldCols} entity={entity}/>
							})}
						</div>

						<Pagination 
							fullCount={fullCount} 
							count={data.length} 
							fnClick={this.clickPagination} 
						/>
					</div>
			    )
			}else{
				return <Alert title="Error" message={this.state.error.message}/> 
			}
	  	}else{
			return <Alert message={i18n_errors.badEntity.replace('{0}', entity)}/>
		}
  	}

})
