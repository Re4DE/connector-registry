{{/*
Copyright (c) 2025 Fraunhofer Institute for Energy Economics and Energy System Technology (IEE)

This program and the accompanying materials are made available under the
terms of the Apache License, Version 2.0 which is available at
https://www.apache.org/licenses/LICENSE-2.0

SPDX-License-Identifier: Apache-2.0

Contributors:
     Fraunhofer IEE - initial API and implementation
*/}}

{{/*
Generates the standard kubernetes labels
*/}}
{{- define "common.labels" -}}
app.kubernetes.io/name: connector-registry
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/component: connector-registry
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{/*
Generates labels to match immutable field like deployment templates or services
*/}}
{{- define "common.matchLabels" -}}
app.kubernetes.io/name: connector-registry
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: connector-registry
{{- end -}}

{{/*
Generates a name containing the release name and the app name
*/}}
{{- define "common.name" -}}
{{ .Release.Name }}-connector-registry
{{- end -}}

{{/*
Allow the release namespace to be overridden for multi-namespace deployments in combined charts
*/}}
{{- define "common.namespace" -}}
{{- default .Release.Namespace .Values.namespaceOverride | trimSuffix "-" }}
{{- end -}}