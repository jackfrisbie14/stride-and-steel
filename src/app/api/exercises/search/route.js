import { NextResponse } from "next/server";

const EXERCISEDB_BASE = "https://exercisedb.dev/api/v1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ exercises: [] });
  }

  try {
    const res = await fetch(
      `${EXERCISEDB_BASE}/exercises/search?q=${encodeURIComponent(query)}&limit=1&threshold=0.4`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!res.ok) {
      return NextResponse.json({ exercises: [] });
    }

    const data = await res.json();
    const exercises = (data.data || []).map((ex) => ({
      id: ex.exerciseId,
      name: ex.name,
      gifUrl: ex.gifUrl,
      targetMuscles: ex.targetMuscles,
      bodyParts: ex.bodyParts,
      equipments: ex.equipments,
      instructions: ex.instructions,
    }));

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("ExerciseDB search error:", error);
    return NextResponse.json({ exercises: [] });
  }
}
