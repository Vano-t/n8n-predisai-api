import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'n8n-workflow';

const versionDescription: INodeTypeDescription = {
		displayName: 'Predis API',
		name: 'predis',
		icon: 'file:predis.svg',
		group: ['transform'],
		version: 1,
		description: 'Interagit avec l’API Predis.ai via plusieurs endpoints',
		defaults: {
			name: 'Predis API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'predisApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Brand ID',
				name: 'brandId',
				type: 'string',
				default: '',
				placeholder: 'YOUR_BRAND_ID',
				description: 'Identifiant unique de votre marque (disponible sur Predis.ai)',
				required: true,
			},
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'options',
				options: [
					{
						name: 'Créer Un Post',
						value: 'create_content',
					},
					{
						name: 'Obtenir Tous Les Posts',
						value: 'get_posts',
					},
					{
						name: 'Liste Des Templates',
						value: 'get_templates',
					},
				],
				default: 'create_content',
				description: 'Choisissez l’opération à exécuter',
			},
			// Propriétés pour "Créer un post"
			{
				displayName: 'Texte',
				name: 'text',
				type: 'string',
				default: '',
				placeholder: 'Entrez votre prompt',
				description: 'Texte décrivant le sujet (min. 20 caractères et 3 mots).',
				required: true,
				displayOptions: {
					show: {
						endpoint: [
							'create_content',
						],
					},
				},
			},
			{
				displayName: 'Type De Post',
				name: 'postType',
				type: 'options',
				options: [
					{ name: 'Generic', value: 'generic' },
					{ name: 'Meme', value: 'meme' },
					{ name: 'Quotes', value: 'quotes' },
				],
				default: 'generic',
				description: 'Type de post à générer',
				displayOptions: {
					show: {
						endpoint: [
							'create_content',
						],
					},
				},
			},
			{
				displayName: 'Type De Média',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Image Unique', value: 'single_image' },
					{ name: 'Carousel', value: 'carousel' },
					{ name: 'Vidéo', value: 'video' },
				],
				default: 'single_image',
				description: 'Type de média du post',
				displayOptions: {
					show: {
						endpoint: [
							'create_content',
						],
					},
				},
			},
			// Propriétés pour "Obtenir tous les posts"
			{
				displayName: 'Media Type (Optionnel)',
				name: 'mediaTypeGet',
				type: 'options',
				options: [
					{ name: 'Image Unique', value: 'single_image' },
					{ name: 'Carousel', value: 'carousel' },
					{ name: 'Vidéo', value: 'video' },
				],
				default: 'single_image',
				description: 'Filtre par type de média (facultatif)',
				displayOptions: {
					show: {
						endpoint: [
							'get_posts',
						],
					},
				},
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Numéro de page à récupérer',
				displayOptions: {
					show: {
						endpoint: [
							'get_posts',
						],
					},
				},
			},
			{
				displayName: 'Nombre D’items Par Page',
				name: 'itemsPerPage',
				type: 'number',
				default: 10,
				description: 'Nombre d’items à récupérer (max 20)',
				displayOptions: {
					show: {
						endpoint: [
							'get_posts',
						],
					},
				},
			},
			// Propriétés pour "Liste des templates"
			{
				displayName: 'Media Type (Optionnel)',
				name: 'mediaTypeTemplates',
				type: 'options',
				options: [
					{ name: 'Image Unique', value: 'single_image' },
					{ name: 'Carousel', value: 'carousel' },
					{ name: 'Vidéo', value: 'video' },
				],
				default: 'single_image',
				description: 'Filtre par type de média (facultatif)',
				displayOptions: {
					show: {
						endpoint: [
							'get_templates',
						],
					},
				},
			},
			{
				displayName: 'Type De Post (Optionnel)',
				name: 'postTypeTemplates',
				type: 'options',
				options: [
					{ name: 'Generic', value: 'generic' },
					{ name: 'Meme', value: 'meme' },
					{ name: 'Quotes', value: 'quotes' },
				],
				default: 'generic',
				description: 'Filtre par type de post (facultatif)',
				displayOptions: {
					show: {
						endpoint: [
							'get_templates',
						],
					},
				},
			},
			{
				displayName: 'Aspect Ratio',
				name: 'aspectRatio',
				type: 'options',
				options: [
					{ name: 'Square', value: 'square' },
					{ name: 'Portrait', value: 'portrait' },
					{ name: 'Landscape', value: 'landscape' },
					{ name: 'All', value: 'all' },
				],
				default: 'all',
				description: 'Filtre par ratio (facultatif)',
				displayOptions: {
					show: {
						endpoint: [
							'get_templates',
						],
					},
				},
			},
			{
				displayName: 'Page',
				name: 'pageTemplates',
				type: 'number',
				default: 1,
				description: 'Numéro de page à récupérer',
				displayOptions: {
					show: {
						endpoint: [
							'get_templates',
						],
					},
				},
			},
			{
				displayName: 'Nombre D’items Par Page',
				name: 'itemsPerPageTemplates',
				type: 'number',
				default: 10,
				description: 'Nombre d’items à récupérer (max 20)',
				displayOptions: {
					show: {
						endpoint: [
							'get_templates',
						],
					},
				},
			},
		],
	};

export class PredisV1 implements INodeType {
	description: INodeTypeDescription;
		
	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const endpointChoice = this.getNodeParameter('endpoint', 0) as string;
		let responseData: IDataObject;

		for (let i = 0; i < items.length; i++) {
			const brandId = this.getNodeParameter('brandId', i) as string;
			let requestOptions: IDataObject = { json: true };

			if (endpointChoice === 'create_content') {
				const text = this.getNodeParameter('text', i) as string;
				const postType = this.getNodeParameter('postType', i) as string;
				const mediaType = this.getNodeParameter('mediaType', i) as string;

				const formData: IDataObject = {
					brand_id: brandId,
					text: text,
					post_type: postType,
					media_type: mediaType,
				};

				requestOptions = {
					method: 'POST',
					uri: 'https://brain.predis.ai/predis_api/v1/create_content/',
					formData,
					json: true,
				};
			} else if (endpointChoice === 'get_posts') {
				const mediaTypeGet = this.getNodeParameter('mediaTypeGet', i) as string;
				const page = this.getNodeParameter('page', i) as number;
				const itemsPerPage = this.getNodeParameter('itemsPerPage', i) as number;

				const qs: IDataObject = {
					brand_id: brandId,
					page_n: page,
					items_n: itemsPerPage,
				};
				if (mediaTypeGet) {
					qs.media_type = mediaTypeGet;
				}

				requestOptions = {
					method: 'GET',
					uri: 'https://brain.predis.ai/predis_api/v1/get_posts/',
					qs,
					json: true,
				};
			} else if (endpointChoice === 'get_templates') {
				const mediaTypeTemplates = this.getNodeParameter('mediaTypeTemplates', i) as string;
				const postTypeTemplates = this.getNodeParameter('postTypeTemplates', i) as string;
				const aspectRatio = this.getNodeParameter('aspectRatio', i) as string;
				const page = this.getNodeParameter('pageTemplates', i) as number;
				const itemsPerPageTemplates = this.getNodeParameter('itemsPerPageTemplates', i) as number;

				const qs: IDataObject = {
					brand_id: brandId,
					page_n: page,
					items_n: itemsPerPageTemplates,
					aspect_ratio: aspectRatio,
				};
				if (mediaTypeTemplates) {
					qs.media_type = mediaTypeTemplates;
				}
				if (postTypeTemplates) {
					qs.post_type = postTypeTemplates;
				}

				requestOptions = {
					method: 'GET',
					uri: 'https://brain.predis.ai/predis_api/v1/get_templates/',
					qs,
					json: true,
				};
			}

			try {
				responseData = await this.helpers.requestWithAuthentication.call(this, 'predisApi', requestOptions);
				returnData.push(responseData);
			} catch (error) {
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
