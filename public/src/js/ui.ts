import { IClip } from '../../../src/models/Clip';

export interface Response<T> {
	data: T;
	message: string;
}

export const displayOutput = <T extends IClip>(clip: T) => {
	const output = document.querySelector('#output-area') as HTMLDivElement;

	output.querySelector('#output-title .title')!.textContent = clip.title;
	output.querySelector('#output-content .code')!.textContent =
		'Code: ' + clip.accessCode;
	output.querySelector('#output-content .code')!.classList.add('py-1');
	output.querySelector('#output-content .content')!.textContent = clip.content;
	output.querySelector('#output-content .content')!.classList.add('py-1');
};
