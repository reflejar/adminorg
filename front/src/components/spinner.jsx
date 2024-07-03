import React from 'react';
import { ClipLoader } from 'react-spinners';


class SpinnerComponent extends React.Component {
    state = {
        loading: true
    };
	render() {
		return (
			<div className='min-vh-25 d-flex align-items-center justify-content-center'>
				<ClipLoader
					className="clip-loader"
					size={60}
					color={'#1CBCD8'}
					loading={this.state.loading}
				/>
			</div> 
		)
	}
}

export default SpinnerComponent;