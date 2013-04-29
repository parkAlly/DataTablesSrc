

(/** @lends <global> */function() {

var _api = DataTable.Api;





/**
 *
 */
_api.register( 'rows()', function ( selector, opts ) {
	// argument shifting
	if ( selector === undefined ) {
		selector = '';
	}
	else if ( $.isPlainObject( selector ) ) {
		opts = selector;
		selector = '';
	}

	opts = _selector_opts( opts );

	var inst = this.iterator( 'table', function ( settings ) {
		return _row_selector( settings, selector, opts );
	} );

	// Want argument shifting here and in _row_selector?
	inst.selector.rows = selector;
	inst.selector.opts = opts;

	return inst;
} );


_api.register( 'rows().nodes()', function () {
	return this.iterator( 'row', function ( settings, row ) {
		// use pluck order on an array rather - rows gives an array, row gives it individually
		return settings.aoData[ row ].nTr || undefined;
	} );
} );


_api.register( 'rows().cells()', function () {
	return this.iterator( true, 'row', function ( settings, row ) {
		return settings.aoData[ row ].anCells || undefined;
	} );
} );


_api.register( 'rows().data()', function ( data ) {
	return this.iterator( true, 'rows', function ( settings, rows ) {
		return _pluck_order( settings.aoData, rows, '_aData' );
	} );
} );


_api.register( 'rows().remove()', function () {
	var that = this;

	// Needs either a corrector to correct for deleted row indexes, or
	// need to order and reverse so indexing is maintained for the row
	// indexes. Damn
	// @todo
	return this.iterator( true, 'row', function ( settings, row, thatIdx ) {
		var data = settings.aoData;

		data.splice( row, 1 );

		// Update the _DT_RowIndex parameter on all rows in the table
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			if ( data[i].nTr !== null ) {
				data[i].nTr._DT_RowIndex = i;
			}
		}

		// Remove the target row from the search array
		var displayIndex = $.inArray( row, settings.aiDisplay );
		settings.asDataSearch.splice( displayIndex, 1 );

		// Delete from the display arrays
		_fnDeleteIndex( settings.aiDisplayMaster, row );
		_fnDeleteIndex( settings.aiDisplay, row );
		_fnDeleteIndex( that[ thatIdx ], row, false );

		// Check for an 'overflow' they case for displaying the table
		_fnLengthOverflow( settings );
	} );
} );


}());
