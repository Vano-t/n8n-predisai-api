import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { PredisV1 } from './Predis/Predis.node';

export class Preids extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Predis API',
			name: 'predis',
			icon: 'file:predis.svg',
			group: ['output'],
			defaultVersion: 1,
			description: 'Sends request to Predis.ai',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new PredisV1(baseDescription)
		};

		super(nodeVersions, baseDescription);
	}
}