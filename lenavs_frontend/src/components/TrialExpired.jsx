import React from 'react'

export default function TrialExpired() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#020617',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <h1>Período gratuito encerrado</h1>

        <p style={{ margin: '16px 0', opacity: 0.85 }}>
          Seu trial de 7 dias da <strong>LenaVS</strong> terminou.
          Para continuar criando vídeos de karaokê,
          ative seu plano.
        </p>

        <button
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: '#22c55e',
            fontWeight: 'bold'
          }}
          onClick={() => alert('Stripe virá aqui')}
        >
          Ativar plano
        </button>
      </div>
    </div>
  )
}
