import { describe, it, expect } from '@jest/globals';
import { justify, justifyLine } from '../src/justifyText';

describe('justify', () => {
    it('should justify the text correctly', () => {
        const inputText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras commodo neque' +
            ' in massa tempor, nec fermentum ex scelerisque. Proin vel ante viverra, auctor tortor non, lacinia' +
            ' nulla. Aliquam erat volutpat. Aliquam hendrerit turpis ac sem aliquam aliquam. Ut sollicitudin laoreet' +
            ' tincidunt. Cras ullamcorper sem et risus lobortis, sit amet tincidunt mauris ornare. Proin tincidunt ' +
            'neque nec egestas mollis. Mauris consequat sapien gravida velit bibendum aliquam. Duis odio leo, ' +
            'dictum ut neque sed, pretium blandit odio. Nulla facilisi. Aenean finibus tellus non nulla consequat,' +
            ' ut consequat est pellentesque. Donec posuere sollicitudin neque, id fermentum mi ornare a.';
        const justifiedText = justify(inputText);

        expect(justifiedText).toEqual('Lorem  ipsum  dolor sit amet, consectetur adipiscing elit. Cras commodo neque in\n' +
            'massa  tempor,  nec  fermentum  ex  scelerisque.  Proin vel ante viverra, auctor\n' +
            'tortor  non,  lacinia  nulla. Aliquam erat volutpat. Aliquam hendrerit turpis ac\n' +
            'sem  aliquam aliquam. Ut sollicitudin laoreet tincidunt. Cras ullamcorper sem et\n' +
            'risus  lobortis,  sit  amet  tincidunt  mauris ornare. Proin tincidunt neque nec\n' +
            'egestas  mollis.  Mauris  consequat  sapien gravida velit bibendum aliquam. Duis\n' +
            'odio  leo,  dictum  ut  neque  sed, pretium blandit odio. Nulla facilisi. Aenean\n' +
            'finibus tellus non nulla consequat, ut consequat est pellentesque. Donec posuere\n' +
            'sollicitudin neque, id fermentum mi ornare a.                                   ');
    });
});

describe('justifyLine', () => {
    it('should justify the line correctly', () => {
        const inputLine = 'Cras vel nisl nulla. Etiam ut enim a leo elementum tincidunt. Suspendisse' +
            ' molestie massa sit amet quam convallis dapibus. Vestibulum laoreet fermentum aliquam.';
        const justifiedLine = justifyLine(inputLine);

        expect(justifiedLine).toEqual('Cras  vel  nisl  nulla.  Etiam  ut  enim  a leo elementum tincidunt. Suspendisse\n' +
            'molestie  massa  sit  amet  quam convallis dapibus. Vestibulum laoreet fermentum\n' +
            'aliquam.                                                                        ');
    });
});
