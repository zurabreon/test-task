/**
 * Модуль содержит ключи интеграции и другие конфигурации
 */
const config = {
	// данные для api amocrm
	CLIENT_ID: "e7b44b96-1d16-4437-b7ad-76dfa5080729",
	CLIENT_SECRET: "5wL20tWXpmBV8kicGVodrGubLVC6tzGaYHAcYpLGWX66WoJLVYuj3A9TuZA0wSAj",
	//AUTH_CODE живет 20 минут, при перезапуске скрипта нужно брать новый
	AUTH_CODE: "def5020018f33c460dde992ae3652d32b1d8eb9f4380bc87713aa29fb8720a7926b078e508da44a9f7015ad71cebd94ff3a4cbc25d9e9f1a01514509d0c4a1f3d16644116ea1da3216f8b5781cb4909e991a46df6bfc0d62a09bd967c3a527d46cf0816c88969597ea500a4b3265d897346ad0ae498293320654c5f575d0be63562d2e3c6943ced53d6a48005e50c19662745e416dbab11d8de56ae68957ab0b92d9b36ad1b2d16fb1e941b18f62324087a9823208343ecf486efc06ce86c4ecb20cdb7428c1f281c7856108c42e377a8ee66e89ad2b6f46b8c70b0701fd9359163428f6942f1ec70f39c66667d2944f3efcb566998bffb4e4af3525c4844a64ae122bd62a123e3f9b72c919fc4f0f72607dabacada15071d41f1be5a55f02cde04366ccff9c0faadb1fd087b4e334c169bf8177eaf80dbd76eb27558dfee987c8b7badc9f3a0b5ced2736e3adb604b154396a87420a930c99ecb5e2a1fe588f486983245da643d34e327b64bcf78e1f337823e98c6116985e719ff29284d68b908d31c32552616d5f85ab2a7e9158de410ff2e5a95ca3bca50bb74a93db936316d771570958e0d7ac111fea97916c7066b7a9177481b24b0f2c78d66d4d4c08df3d0e43e52d965536091247f1a29d16ecbb4f1c0bab5d2dfbb16dbbbda536f4001f62dcca4d6a6b2d179175855561c5a28d3f428eeee0f8",
	REDIRECT_URI: "https://6579-77-95-90-50.ngrok-free.app",
	SUB_DOMAIN: "new1701950444",
	// конфигурация сервера
	PORT: 2000,
}; 

module.exports = config;
