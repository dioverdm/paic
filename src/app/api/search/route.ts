import { NextRequest, NextResponse } from "next/server";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return Response.json({ error: "No Query provided" }, { status: 401 });
  }

  const tool = new DuckDuckGoSearch({ maxResults: 3 });

  const results = await tool.invoke(query);

  console.log(results, "results");

  return NextResponse.json({ results: results });
}
