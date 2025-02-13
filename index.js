import whoiser from "npm:whoiser";

// WHOIS情報を取得する関数
async function getWhoisData(domain) {
	try {
		const domainInfo = await whoiser(domain);
		return domainInfo;
	} catch (error) {
		throw new Error(`Failed to fetch WHOIS data: ${error.message}`);
	}
}

// HTTPサーバーの作成
Deno.serve(async (req) => {
	const url = new URL(req.url);
	const domain = url.searchParams.get("domain");

	// CORSプリフライトリクエスト対応
	if (req.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
		});
	}

	if (!domain) {
		return new Response(JSON.stringify({ error: "Domain parameter is required" }), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	}

	try {
		const whoisData = await getWhoisData(domain);
		return new Response(JSON.stringify(whoisData, null, 2), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	}
});