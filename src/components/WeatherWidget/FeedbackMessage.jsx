import React from 'react';

export default function IdleMessage({ title = '', message = '' }) {
	return (
		<div>
			<h1>{title}</h1>
			<p style={{ marginTop: '10px' }}>{message}</p>
		</div>
	);
}
