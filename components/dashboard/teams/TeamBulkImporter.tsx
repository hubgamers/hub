'use client'

import { useState, useRef } from 'react'
import { Upload, RotateCcw, Check, AlertCircle, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { bulkCreateTeamsWithPlayers, type BulkImportTeamData } from '@/lib/actions/team/team.actions'

type ParsedData = {
  teamColumns: {
    name?: string
    slug?: string
    logoUrl?: string
  }
  playerColumns: {
    nickname?: string
    number?: string
    role?: string
  }
  rows: Record<string, string | number>[]
  availableColumns: string[]
}

type Props = {
  organizationId: string
}

export default function TeamBulkImporter({ organizationId }: Props) {
  const [step, setStep] = useState<'upload' | 'configure' | 'preview'>('upload')
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(worksheet)

        if (rows.length === 0) {
          alert('Fichier vide ou format invalide')
          return
        }

        const availableColumns = Object.keys(rows[0] || {})

        setParsedData({
          teamColumns: {
            name: availableColumns.find(col => 
              col.toLowerCase().includes('équipe') ||
              col.toLowerCase().includes('equipe') ||
              col.toLowerCase().includes('team') ||
              col.toLowerCase().includes('societe')
            ),
            slug: availableColumns.find(col => 
              col.toLowerCase().includes('slug')
            ),
            logoUrl: availableColumns.find(col => 
              col.toLowerCase().includes('logo')
            ),
          },
          playerColumns: {
            nickname: availableColumns.find(col => 
              col.toLowerCase().includes('joueur') ||
              col.toLowerCase().includes('player') ||
              col.toLowerCase().includes('nom') || 
              col.toLowerCase().includes('prenom') ||
              col.toLowerCase().includes('name')
            ),
            number: availableColumns.find(col => 
              col.toLowerCase().includes('numéro') ||
              col.toLowerCase().includes('numero') ||
              col.toLowerCase().includes('number') ||
              col.toLowerCase().includes('#')
            ),
            role: availableColumns.find(col => 
              col.toLowerCase().includes('rôle') ||
              col.toLowerCase().includes('role')
            ),
          },
          rows: rows as Record<string, string | number>[],
          availableColumns,
        })
        setStep('configure')
      } catch (error) {
        alert('Erreur lors de la lecture du fichier: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleConfigChange = (field: string, value: string | undefined) => {
    if (!parsedData) return
    
    if (field.startsWith('teamColumns.')) {
      const columnName = field.split('.')[1]
      setParsedData({
        ...parsedData,
        teamColumns: {
          ...parsedData.teamColumns,
          [columnName]: value,
        },
      })
    } else if (field.startsWith('playerColumns.')) {
      const columnName = field.split('.')[1]
      setParsedData({
        ...parsedData,
        playerColumns: {
          ...parsedData.playerColumns,
          [columnName]: value,
        },
      })
    }
  }

  const generatePreview = (): BulkImportTeamData[] => {
    if (!parsedData || !parsedData.teamColumns.name) return []

    const teamsMap = new Map<string, BulkImportTeamData>()

    for (const row of parsedData.rows) {
      const teamName = String(row[parsedData.teamColumns.name] || '').trim()
      if (!teamName) continue

      if (!teamsMap.has(teamName)) {
        teamsMap.set(teamName, {
          teamName,
          teamSlug: parsedData.teamColumns.slug 
            ? String(row[parsedData.teamColumns.slug] || '').trim() || undefined
            : undefined,
          teamLogoUrl: parsedData.teamColumns.logoUrl 
            ? String(row[parsedData.teamColumns.logoUrl] || '').trim() || undefined
            : undefined,
          players: [],
        })
      }

      const team = teamsMap.get(teamName)!
      const nickname = parsedData.playerColumns.nickname
        ? String(row[parsedData.playerColumns.nickname] || '').trim()
        : ''

      if (nickname) {
        team.players.push({
          nickname,
          number: parsedData.playerColumns.number
            ? parseInt(String(row[parsedData.playerColumns.number])) || undefined
            : undefined,
          role: parsedData.playerColumns.role
            ? String(row[parsedData.playerColumns.role] || '').trim() || undefined
            : undefined,
        })
      }
    }

    return Array.from(teamsMap.values())
  }

  const handleImport = async () => {
    const importData = generatePreview()
    if (importData.length === 0) {
      alert('Aucune donnée valide à importer')
      return
    }

    setIsLoading(true)
    try {
      const res = await bulkCreateTeamsWithPlayers(organizationId, importData)
      setResult(res)
      setStep('preview')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setStep('upload')
    setParsedData(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // STEP 1: Upload
  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold">Importer des équipes</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Téléchargez un fichier Excel avec les colonnes: <strong>Équipe</strong> et <strong>Joueur</strong>
          </p>
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border border-0
                file:text-sm file:font-semibold
                file:bg-teal-50 file:text-teal-700
                hover:file:bg-teal-100 cursor-pointer"
            />
            <p className="mt-2 text-xs text-slate-500">Formats supportés: .xlsx, .xls, .csv</p>
          </div>
        </div>

        {/* Template Example */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-900 mb-3">📋 Modèle de fichier:</p>
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-amber-100">
                  <th className="border border-amber-200 px-3 py-2 text-left font-semibold">Équipe</th>
                  <th className="border border-amber-200 px-3 py-2 text-left font-semibold">Joueur</th>
                </tr>
              </thead>
              <tbody className="text-amber-900">
                <tr>
                  <td className="border border-amber-200 px-3 py-2">Alpha</td>
                  <td className="border border-amber-200 px-3 py-2">Jean Dupont</td>
                </tr>
                <tr>
                  <td className="border border-amber-200 px-3 py-2">Beta</td>
                  <td className="border border-amber-200 px-3 py-2">Paul Jacques</td>
                </tr>
                <tr>
                  <td className="border border-amber-200 px-3 py-2">Charlie</td>
                  <td className="border border-amber-200 px-3 py-2">Marie Bernard</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-amber-800">
            ✓ Grouper les lignes par équipe
          </p>
        </div>
      </div>
    )
  }

  // STEP 2: Configure columns
  if (step === 'configure' && parsedData) {
    const preview = generatePreview()
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Configurer les colonnes</h2>
          <p className="text-sm text-slate-600 mb-6">Mappez les colonnes de votre fichier vers les propriétés:</p>
          
          <div className="space-y-6">
            {/* TEAM COLUMNS */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="bg-slate-900 text-white rounded px-2 py-1 text-xs font-bold">TEAM</span>
                Propriétés de l'équipe
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    📌 Nom d'équipe <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-600 mb-3">Obligatoire - groupe les joueurs</p>
                  <select
                    value={parsedData.teamColumns.name || ''}
                    onChange={(e) => handleConfigChange('teamColumns.name', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium"
                  >
                    <option value="">-- Sélectionner --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    🔗 Slug d'équipe
                  </label>
                  <p className="text-xs text-slate-600 mb-3">Optionnel - généré sinon</p>
                  <select
                    value={parsedData.teamColumns.slug || ''}
                    onChange={(e) => handleConfigChange('teamColumns.slug', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">-- Aucun --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    🖼️ Logo d'équipe
                  </label>
                  <p className="text-xs text-slate-600 mb-3">Optionnel - URL du logo</p>
                  <select
                    value={parsedData.teamColumns.logoUrl || ''}
                    onChange={(e) => handleConfigChange('teamColumns.logoUrl', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">-- Aucun --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* PLAYER COLUMNS */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="bg-emerald-600 text-white rounded px-2 py-1 text-xs font-bold">PLAYER</span>
                Propriétés des joueurs
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <label className="block text-sm font-semibold text-emerald-900 mb-2">
                    👤 Nom du joueur
                  </label>
                  <p className="text-xs text-emerald-700 mb-3">Crée les joueurs sous l'équipe</p>
                  <select
                    value={parsedData.playerColumns.nickname || ''}
                    onChange={(e) => handleConfigChange('playerColumns.nickname', e.target.value)}
                    className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">-- Aucun --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    #️⃣ Numéro du joueur
                  </label>
                  <p className="text-xs text-blue-700 mb-3">Numéro du maillot (champ Player)</p>
                  <select
                    value={parsedData.playerColumns.number || ''}
                    onChange={(e) => handleConfigChange('playerColumns.number', e.target.value)}
                    className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">-- Aucun --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    🎯 Rôle du joueur
                  </label>
                  <p className="text-xs text-purple-700 mb-3">Position/poste du joueur</p>
                  <select
                    value={parsedData.playerColumns.role || ''}
                    onChange={(e) => handleConfigChange('playerColumns.role', e.target.value)}
                    className="w-full rounded-lg border border-purple-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">-- Aucun --</option>
                    {parsedData.availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">
            Aperçu ({preview.length} équipe{preview.length !== 1 ? 's' : ''})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {preview.map((team, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="font-semibold text-slate-900">{team.teamName}</p>
                {team.players.length > 0 && (
                  <div className="mt-2 text-sm text-slate-600">
                    <p className="text-xs uppercase text-slate-500 mb-1">
                      {team.players.length} joueur{team.players.length !== 1 ? 's' : ''}
                    </p>
                    <ul className="space-y-1">
                      {team.players.slice(0, 3).map((player, pIdx) => (
                        <li key={pIdx} className="text-xs">
                          • {player.nickname}
                          {player.number && ` (#${player.number})`}
                          {player.role && ` - ${player.role}`}
                        </li>
                      ))}
                      {team.players.length > 3 && (
                        <li className="text-xs text-slate-400">
                          ... +{team.players.length - 3} de plus
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || !parsedData.teamColumns.name}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Importer ({preview.length} équipe{preview.length !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    )
  }

  // STEP 3: Result
  if (step === 'preview' && result) {
    return (
      <div className="rounded-2xl border-2 p-6 bg-white" style={{
        borderColor: result.success ? '#10b981' : '#ef4444'
      }}>
        <div className="flex items-start gap-3">
          {result.success ? (
            <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">
              {result.success ? 'Import réussi! ✓' : 'Erreurs lors de l\'import'}
            </h2>
            <p className="text-sm text-slate-600 mb-3">{result.message}</p>
            
            {result.errors && Array.isArray(result.errors) && result.errors.length > 0 && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200">
                <p className="text-xs font-semibold text-red-700 mb-2">Erreurs:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {(result.errors as string[]).map((err: string, idx: number) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-slate-500 space-y-1">
              <p>✓ {result.createdTeams} équipe(s) créée(s)</p>
              <p>✓ {result.createdPlayers} joueur(s) créé(s)</p>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Importer un autre fichier
        </button>
      </div>
    )
  }

  return null
}
