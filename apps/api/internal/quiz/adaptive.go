package quiz

import (
	"math"
	"sort"

	"github.com/hasanwirayuda/schomora/api/internal/models"
)

const (
    abilityMin      = 0.0
    abilityMax      = 1.0
    abilityDefault  = 0.5
    learningRate    = 0.1
)

// UpdateAbility menghitung ability estimate baru setelah menjawab soal.
// Jawaban benar → ability naik, jawaban salah → ability turun.
// Magnitude perubahan bergantung pada selisih difficulty vs ability saat ini.
func UpdateAbility(currentAbility float64, isCorrect bool, difficulty float64) float64 {
    var delta float64

    if isCorrect {
        // Benar soal susah → naik lebih banyak
        // Benar soal mudah → naik sedikit
        delta = learningRate * (1 - currentAbility) * difficulty
    } else {
        // Salah soal mudah → turun lebih banyak
        // Salah soal susah → turun sedikit
        delta = -learningRate * currentAbility * (1 - difficulty)
    }

    newAbility := currentAbility + delta
    return math.Max(abilityMin, math.Min(abilityMax, newAbility))
}

// SelectNextQuestion memilih soal yang difficulty-nya paling mendekati
// ability estimate student saat ini, dari pool soal yang belum dijawab.
func SelectNextQuestion(ability float64, questions []models.Question, answeredIDs map[string]bool) *models.Question {
    var candidates []models.Question

    for _, q := range questions {
        if !answeredIDs[q.ID.String()] {
            candidates = append(candidates, q)
        }
    }

    if len(candidates) == 0 {
        return nil
    }

    // Sort berdasarkan jarak difficulty ke ability
    sort.Slice(candidates, func(i, j int) bool {
        distI := math.Abs(candidates[i].Difficulty - ability)
        distJ := math.Abs(candidates[j].Difficulty - ability)
        return distI < distJ
    })

    return &candidates[0]
}

// CalculateScore menghitung skor akhir (0-100) dari jumlah jawaban benar
func CalculateScore(totalCorrect, totalQuestions int) float64 {
    if totalQuestions == 0 {
        return 0
    }
    return math.Round((float64(totalCorrect) / float64(totalQuestions)) * 100)
}