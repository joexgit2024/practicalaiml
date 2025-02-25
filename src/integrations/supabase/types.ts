export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aging_inventory_forecasts: {
        Row: {
          clearance_recommendation: boolean | null
          confidence_level: Database["public"]["Enums"]["forecast_confidence"]
          created_at: string | null
          economic_indicators: Json | null
          forecast_date: string | null
          historical_sales_pattern: Json | null
          id: string
          inventory_id: string | null
          predicted_demand: number
          recommended_discount_percentage: number | null
          seasonal_factors: Json | null
          updated_at: string | null
        }
        Insert: {
          clearance_recommendation?: boolean | null
          confidence_level: Database["public"]["Enums"]["forecast_confidence"]
          created_at?: string | null
          economic_indicators?: Json | null
          forecast_date?: string | null
          historical_sales_pattern?: Json | null
          id?: string
          inventory_id?: string | null
          predicted_demand: number
          recommended_discount_percentage?: number | null
          seasonal_factors?: Json | null
          updated_at?: string | null
        }
        Update: {
          clearance_recommendation?: boolean | null
          confidence_level?: Database["public"]["Enums"]["forecast_confidence"]
          created_at?: string | null
          economic_indicators?: Json | null
          forecast_date?: string | null
          historical_sales_pattern?: Json | null
          id?: string
          inventory_id?: string | null
          predicted_demand?: number
          recommended_discount_percentage?: number | null
          seasonal_factors?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aging_inventory_forecasts_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      aging_inventory_recommendations: {
        Row: {
          created_at: string | null
          id: string
          implemented_at: string | null
          inventory_id: string | null
          potential_impact: number | null
          priority: number | null
          recommendation_type: string
          success_metrics: Json | null
          suggested_action: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          implemented_at?: string | null
          inventory_id?: string | null
          potential_impact?: number | null
          priority?: number | null
          recommendation_type: string
          success_metrics?: Json | null
          suggested_action: string
        }
        Update: {
          created_at?: string | null
          id?: string
          implemented_at?: string | null
          inventory_id?: string | null
          potential_impact?: number | null
          priority?: number | null
          recommendation_type?: string
          success_metrics?: Json | null
          suggested_action?: string
        }
        Relationships: [
          {
            foreignKeyName: "aging_inventory_recommendations_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      category_alert_settings: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string | null
          id: string
          threshold_unit: Database["public"]["Enums"]["alert_threshold_unit"]
          threshold_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          id?: string
          threshold_unit: Database["public"]["Enums"]["alert_threshold_unit"]
          threshold_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          id?: string
          threshold_unit?: Database["public"]["Enums"]["alert_threshold_unit"]
          threshold_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      commercial_customer: {
        Row: {
          address: string | null
          contactname: string | null
          country: string | null
          customer_id: string
          customername: string | null
          email: string | null
          freightfund: string | null
          margincategory: string | null
          phone: string | null
          profitability: number | null
          salesname: string | null
        }
        Insert: {
          address?: string | null
          contactname?: string | null
          country?: string | null
          customer_id: string
          customername?: string | null
          email?: string | null
          freightfund?: string | null
          margincategory?: string | null
          phone?: string | null
          profitability?: number | null
          salesname?: string | null
        }
        Update: {
          address?: string | null
          contactname?: string | null
          country?: string | null
          customer_id?: string
          customername?: string | null
          email?: string | null
          freightfund?: string | null
          margincategory?: string | null
          phone?: string | null
          profitability?: number | null
          salesname?: string | null
        }
        Relationships: []
      }
      cost_alerts: {
        Row: {
          country: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          mode: string | null
          threshold_amount: number
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          mode?: string | null
          threshold_amount: number
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          mode?: string | null
          threshold_amount?: number
        }
        Relationships: []
      }
      cost_saving_scenarios: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters: Json
          results: Json | null
          scenario_type: Database["public"]["Enums"]["cost_scenario_type"]
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters: Json
          results?: Json | null
          scenario_type: Database["public"]["Enums"]["cost_scenario_type"]
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters?: Json
          results?: Json | null
          scenario_type?: Database["public"]["Enums"]["cost_scenario_type"]
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      country_risk_assessments: {
        Row: {
          country: string
          created_at: string | null
          customs_delay_probability: number | null
          factors: Json | null
          historical_delay_days: number | null
          id: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          transportation_risk_score: number | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          customs_delay_probability?: number | null
          factors?: Json | null
          historical_delay_days?: number | null
          id?: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          transportation_risk_score?: number | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          customs_delay_probability?: number | null
          factors?: Json | null
          historical_delay_days?: number | null
          id?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          transportation_risk_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      critical_shipments_base: {
        Row: {
          actual_arrival: string | null
          created_at: string | null
          current_location: string | null
          current_status: string | null
          customer_id: string | null
          customs_status: string | null
          deleted_at: string | null
          destination_country: string | null
          estimated_arrival: string | null
          id: string
          is_expedited: boolean | null
          last_tracked_at: string | null
          notes: string | null
          origin_country: string | null
          priority_level: number | null
          shipping_mode: string | null
          tracking_number: string | null
          unit_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          customer_id?: string | null
          customs_status?: string | null
          deleted_at?: string | null
          destination_country?: string | null
          estimated_arrival?: string | null
          id?: string
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country?: string | null
          priority_level?: number | null
          shipping_mode?: string | null
          tracking_number?: string | null
          unit_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          customer_id?: string | null
          customs_status?: string | null
          deleted_at?: string | null
          destination_country?: string | null
          estimated_arrival?: string | null
          id?: string
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country?: string | null
          priority_level?: number | null
          shipping_mode?: string | null
          tracking_number?: string | null
          unit_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_dashboards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string | null
          id: string
          position: number
          size: string
          title: string
          updated_at: string | null
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Insert: {
          config: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          position: number
          size?: string
          title: string
          updated_at?: string | null
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string | null
          id?: string
          position?: number
          size?: string
          title?: string
          updated_at?: string | null
          widget_type?: Database["public"]["Enums"]["widget_type"]
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          date: string | null
          driver_professionalism: number | null
          id: string
          product_functionality: number | null
          setup_experience: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          driver_professionalism?: number | null
          id?: string
          product_functionality?: number | null
          setup_experience?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          driver_professionalism?: number | null
          id?: string
          product_functionality?: number | null
          setup_experience?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dynamic_pricing_recommendations: {
        Row: {
          confidence_score: number
          created_at: string | null
          current_price: number
          discount_percentage: number
          historical_demand: Json
          id: string
          market_factors: Json
          product_name: string
          recommended_price: number
          updated_at: string | null
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          current_price: number
          discount_percentage: number
          historical_demand: Json
          id?: string
          market_factors: Json
          product_name: string
          recommended_price: number
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          current_price?: number
          discount_percentage?: number
          historical_demand?: Json
          id?: string
          market_factors?: Json
          product_name?: string
          recommended_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      email_keyword_analysis: {
        Row: {
          created_at: string | null
          email_id: string
          extraction_method: Database["public"]["Enums"]["keyword_extraction_method"]
          id: string
          keywords: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_id: string
          extraction_method: Database["public"]["Enums"]["keyword_extraction_method"]
          id?: string
          keywords: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string
          extraction_method?: Database["public"]["Enums"]["keyword_extraction_method"]
          id?: string
          keywords?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback_analysis: {
        Row: {
          analysis_result: Json | null
          analyzed_at: string | null
          category: string | null
          content: string
          created_at: string | null
          feedback_date: string | null
          id: string
          key_topics: string[] | null
          product_id: string | null
          sentiment: number | null
          source: string
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          analyzed_at?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          feedback_date?: string | null
          id?: string
          key_topics?: string[] | null
          product_id?: string | null
          sentiment?: number | null
          source: string
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          analyzed_at?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          feedback_date?: string | null
          id?: string
          key_topics?: string[] | null
          product_id?: string | null
          sentiment?: number | null
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      food_items: {
        Row: {
          barcode: string | null
          category: Database["public"]["Enums"]["food_category"]
          created_at: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          location: Database["public"]["Enums"]["storage_location"]
          name: string
          nutritional_info: Json | null
          purchase_date: string | null
          quantity: number
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          barcode?: string | null
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          location: Database["public"]["Enums"]["storage_location"]
          name: string
          nutritional_info?: Json | null
          purchase_date?: string | null
          quantity: number
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          barcode?: string | null
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          location?: Database["public"]["Enums"]["storage_location"]
          name?: string
          nutritional_info?: Json | null
          purchase_date?: string | null
          quantity?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inv_product: {
        Row: {
          description: string
          productid: string
        }
        Insert: {
          description: string
          productid: string
        }
        Update: {
          description?: string
          productid?: string
        }
        Relationships: []
      }
      inv_queries: {
        Row: {
          created_at: string | null
          execution_context: Json | null
          generated_sql: string | null
          id: string
          question: string
          response: string | null
          status: Database["public"]["Enums"]["query_status"] | null
          target_tables: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          execution_context?: Json | null
          generated_sql?: string | null
          id?: string
          question: string
          response?: string | null
          status?: Database["public"]["Enums"]["query_status"] | null
          target_tables?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          execution_context?: Json | null
          generated_sql?: string | null
          id?: string
          question?: string
          response?: string | null
          status?: Database["public"]["Enums"]["query_status"] | null
          target_tables?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inv_query_feedback: {
        Row: {
          approved_by_admin: boolean | null
          created_at: string | null
          feedback_note: string | null
          feedback_type: string
          id: string
          improved_sql: string | null
          original_sql: string
          query_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_by_admin?: boolean | null
          created_at?: string | null
          feedback_note?: string | null
          feedback_type: string
          id?: string
          improved_sql?: string | null
          original_sql: string
          query_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_by_admin?: boolean | null
          created_at?: string | null
          feedback_note?: string | null
          feedback_type?: string
          id?: string
          improved_sql?: string | null
          original_sql?: string
          query_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inv_query_feedback_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "inv_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      inv_query_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          query_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          query_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          query_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inv_query_logs_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "inv_queries"
            referencedColumns: ["id"]
          },
        ]
      }
      inv_table_metadata: {
        Row: {
          columns: Json | null
          created_at: string | null
          description: string | null
          id: string
          sample_questions: string[] | null
          table_name: string
          unique_values: Json | null
          updated_at: string | null
        }
        Insert: {
          columns?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          sample_questions?: string[] | null
          table_name: string
          unique_values?: Json | null
          updated_at?: string | null
        }
        Update: {
          columns?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          sample_questions?: string[] | null
          table_name?: string
          unique_values?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string | null
          damaged_quantity: number | null
          expiry_date: string | null
          forecast_demand: number | null
          id: string
          inventory_type: string | null
          last_sold_at: string | null
          name: string
          notes: string | null
          quantity: number
          reorder_status: string | null
          reserved_quantity: number | null
          restock_threshold: number | null
          supplier_id: string | null
          tags: string[] | null
          unit_price: number | null
          user_id: string
          warehouse_location: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          damaged_quantity?: number | null
          expiry_date?: string | null
          forecast_demand?: number | null
          id?: string
          inventory_type?: string | null
          last_sold_at?: string | null
          name: string
          notes?: string | null
          quantity?: number
          reorder_status?: string | null
          reserved_quantity?: number | null
          restock_threshold?: number | null
          supplier_id?: string | null
          tags?: string[] | null
          unit_price?: number | null
          user_id: string
          warehouse_location?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          damaged_quantity?: number | null
          expiry_date?: string | null
          forecast_demand?: number | null
          id?: string
          inventory_type?: string | null
          last_sold_at?: string | null
          name?: string
          notes?: string | null
          quantity?: number
          reorder_status?: string | null
          reserved_quantity?: number | null
          restock_threshold?: number | null
          supplier_id?: string | null
          tags?: string[] | null
          unit_price?: number | null
          user_id?: string
          warehouse_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_warehouse_location_fkey"
            columns: ["warehouse_location"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["name"]
          },
        ]
      }
      inventory_forecasts: {
        Row: {
          actual_demand: number | null
          confidence_score: number | null
          contributing_factors: Json | null
          Country: string | null
          created_at: string | null
          forecast_period_end: string
          forecast_period_start: string
          id: string
          item_type: string
          predicted_demand: number
        }
        Insert: {
          actual_demand?: number | null
          confidence_score?: number | null
          contributing_factors?: Json | null
          Country?: string | null
          created_at?: string | null
          forecast_period_end: string
          forecast_period_start: string
          id?: string
          item_type: string
          predicted_demand: number
        }
        Update: {
          actual_demand?: number | null
          confidence_score?: number | null
          contributing_factors?: Json | null
          Country?: string | null
          created_at?: string | null
          forecast_period_end?: string
          forecast_period_start?: string
          id?: string
          item_type?: string
          predicted_demand?: number
        }
        Relationships: []
      }
      inventory_history: {
        Row: {
          action: Database["public"]["Enums"]["inventory_action"]
          created_at: string | null
          food_item_id: string | null
          id: string
          item_category: Database["public"]["Enums"]["food_category"]
          item_name: string
          new_quantity: number
          previous_quantity: number
          quantity_changed: number
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["inventory_action"]
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          item_category: Database["public"]["Enums"]["food_category"]
          item_name: string
          new_quantity: number
          previous_quantity: number
          quantity_changed: number
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["inventory_action"]
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          item_category?: Database["public"]["Enums"]["food_category"]
          item_name?: string
          new_quantity?: number
          previous_quantity?: number
          quantity_changed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_reallocations: {
        Row: {
          completion_date: string | null
          created_at: string | null
          estimated_cost: number | null
          id: string
          inventory_items: Json
          market_analysis: Json | null
          notes: string | null
          potential_revenue_increase: number | null
          priority: number | null
          source_location: string
          status: Database["public"]["Enums"]["reallocation_status"] | null
          target_location: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          inventory_items: Json
          market_analysis?: Json | null
          notes?: string | null
          potential_revenue_increase?: number | null
          priority?: number | null
          source_location: string
          status?: Database["public"]["Enums"]["reallocation_status"] | null
          target_location: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          inventory_items?: Json
          market_analysis?: Json | null
          notes?: string | null
          potential_revenue_increase?: number | null
          priority?: number | null
          source_location?: string
          status?: Database["public"]["Enums"]["reallocation_status"] | null
          target_location?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inventory_returns: {
        Row: {
          id: string
          inventory_id: string
          quantity: number
          return_reason: string | null
          returned_at: string | null
        }
        Insert: {
          id?: string
          inventory_id: string
          quantity: number
          return_reason?: string | null
          returned_at?: string | null
        }
        Update: {
          id?: string
          inventory_id?: string
          quantity?: number
          return_reason?: string | null
          returned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_returns_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: true
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_scenarios: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters: Json
          results: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters: Json
          results?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters?: Json
          results?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          is_read: boolean | null
          message: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          quantity: number
          service_description: string | null
          service_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          quantity: number
          service_description?: string | null
          service_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          quantity?: number
          service_description?: string | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      return_status_history: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          return_id: string | null
          status: Database["public"]["Enums"]["return_status"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          return_id?: string | null
          status: Database["public"]["Enums"]["return_status"]
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          return_id?: string | null
          status?: Database["public"]["Enums"]["return_status"]
        }
        Relationships: [
          {
            foreignKeyName: "return_status_history_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          additional_details: string | null
          carrier: string | null
          created_at: string | null
          customer_email: string
          id: string
          order_number: string
          reason: Database["public"]["Enums"]["return_reason"]
          status: Database["public"]["Enums"]["return_status"]
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_details?: string | null
          carrier?: string | null
          created_at?: string | null
          customer_email: string
          id?: string
          order_number: string
          reason: Database["public"]["Enums"]["return_reason"]
          status?: Database["public"]["Enums"]["return_status"]
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_details?: string | null
          carrier?: string | null
          created_at?: string | null
          customer_email?: string
          id?: string
          order_number?: string
          reason?: Database["public"]["Enums"]["return_reason"]
          status?: Database["public"]["Enums"]["return_status"]
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      risk_factors: {
        Row: {
          created_at: string | null
          id: string
          impact: number
          name: string
          probability: number
          score: number
          status: Database["public"]["Enums"]["risk_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          impact: number
          name: string
          probability: number
          score: number
          status?: Database["public"]["Enums"]["risk_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          impact?: number
          name?: string
          probability?: number
          score?: number
          status?: Database["public"]["Enums"]["risk_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      risk_scenarios: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          estimated_impact: number | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_impact?: number | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_impact?: number | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rl_clearance_actions: {
        Row: {
          action_parameters: Json
          action_type: Database["public"]["Enums"]["rl_action_type"]
          created_at: string | null
          episode_number: number
          experiment_id: string | null
          id: string
          reward: number | null
          state_after: Json | null
          state_before: Json
        }
        Insert: {
          action_parameters: Json
          action_type: Database["public"]["Enums"]["rl_action_type"]
          created_at?: string | null
          episode_number: number
          experiment_id?: string | null
          id?: string
          reward?: number | null
          state_after?: Json | null
          state_before: Json
        }
        Update: {
          action_parameters?: Json
          action_type?: Database["public"]["Enums"]["rl_action_type"]
          created_at?: string | null
          episode_number?: number
          experiment_id?: string | null
          id?: string
          reward?: number | null
          state_after?: Json | null
          state_before?: Json
        }
        Relationships: [
          {
            foreignKeyName: "rl_clearance_actions_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "rl_clearance_experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      rl_clearance_experiments: {
        Row: {
          created_at: string | null
          current_episode: number | null
          description: string | null
          discount_factor: number | null
          epsilon: number | null
          id: string
          insights: Json | null
          learning_rate: number | null
          name: string
          reward_history: number[] | null
          state_history: Json[] | null
          status: string | null
          total_episodes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_episode?: number | null
          description?: string | null
          discount_factor?: number | null
          epsilon?: number | null
          id?: string
          insights?: Json | null
          learning_rate?: number | null
          name: string
          reward_history?: number[] | null
          state_history?: Json[] | null
          status?: string | null
          total_episodes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_episode?: number | null
          description?: string | null
          discount_factor?: number | null
          epsilon?: number | null
          id?: string
          insights?: Json | null
          learning_rate?: number | null
          name?: string
          reward_history?: number[] | null
          state_history?: Json[] | null
          status?: string | null
          total_episodes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_goals: {
        Row: {
          achieved_amount: number | null
          created_at: string | null
          id: string
          notes: string | null
          quarter: number
          target_amount: number
          updated_at: string | null
          user_id: string
          year: number
        }
        Insert: {
          achieved_amount?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quarter: number
          target_amount: number
          updated_at?: string | null
          user_id: string
          year: number
        }
        Update: {
          achieved_amount?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quarter?: number
          target_amount?: number
          updated_at?: string | null
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      "sample_data_transport_billing-audit": {
        Row: {
          Actual_Bill: number | null
          Cost: number | null
          Country: string | null
          Mode: string | null
          Segment: string | null
          Week: number | null
          Year: number | null
        }
        Insert: {
          Actual_Bill?: number | null
          Cost?: number | null
          Country?: string | null
          Mode?: string | null
          Segment?: string | null
          Week?: number | null
          Year?: number | null
        }
        Update: {
          Actual_Bill?: number | null
          Cost?: number | null
          Country?: string | null
          Mode?: string | null
          Segment?: string | null
          Week?: number | null
          Year?: number | null
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          category: Database["public"]["Enums"]["report_category"]
          created_at: string | null
          description: string | null
          id: string
          is_template: boolean | null
          last_run_at: string | null
          name: string
          query_params: Json
          schedule: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["report_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          last_run_at?: string | null
          name: string
          query_params: Json
          schedule?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["report_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          last_run_at?: string | null
          name?: string
          query_params?: Json
          schedule?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scenario_risk_factors: {
        Row: {
          created_at: string | null
          expected_reduction: number | null
          mitigation_action: string
          risk_factor_id: string
          scenario_id: string
        }
        Insert: {
          created_at?: string | null
          expected_reduction?: number | null
          mitigation_action: string
          risk_factor_id: string
          scenario_id: string
        }
        Update: {
          created_at?: string | null
          expected_reduction?: number | null
          mitigation_action?: string
          risk_factor_id?: string
          scenario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenario_risk_factors_risk_factor_id_fkey"
            columns: ["risk_factor_id"]
            isOneToOne: false
            referencedRelation: "risk_factors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenario_risk_factors_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "risk_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          parameters: Json
          results: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json
          results?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json
          results?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      shipment_status_updates: {
        Row: {
          details: Json | null
          id: string
          location: string | null
          shipment_id: string | null
          status: string
          timestamp: string | null
        }
        Insert: {
          details?: Json | null
          id?: string
          location?: string | null
          shipment_id?: string | null
          status: string
          timestamp?: string | null
        }
        Update: {
          details?: Json | null
          id?: string
          location?: string | null
          shipment_id?: string | null
          status?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_status_updates_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipment_status_updates_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "supply_chain_kpi_view"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_arrival: string | null
          actualbilling: number | null
          carrier: string | null
          created_at: string | null
          current_location: string | null
          current_status: string
          customer_id: string | null
          customs_status: string | null
          destination_country: string
          estimated_arrival: string | null
          id: string
          is_expedited: boolean | null
          last_tracked_at: string | null
          notes: string | null
          origin_country: string
          priority_level: number | null
          product_value: number | null
          shipment_cost: number | null
          shipping_mode: Database["public"]["Enums"]["shipping_mode"]
          tracking_number: string
          units: number | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          actualbilling?: number | null
          carrier?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status: string
          customer_id?: string | null
          customs_status?: string | null
          destination_country: string
          estimated_arrival?: string | null
          id?: string
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country: string
          priority_level?: number | null
          product_value?: number | null
          shipment_cost?: number | null
          shipping_mode: Database["public"]["Enums"]["shipping_mode"]
          tracking_number: string
          units?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          actualbilling?: number | null
          carrier?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string
          customer_id?: string | null
          customs_status?: string | null
          destination_country?: string
          estimated_arrival?: string | null
          id?: string
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country?: string
          priority_level?: number | null
          product_value?: number | null
          shipment_cost?: number | null
          shipping_mode?: Database["public"]["Enums"]["shipping_mode"]
          tracking_number?: string
          units?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "commercial_customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      supplier_risk_assessments: {
        Row: {
          assessed_at: string | null
          assessed_by: string | null
          geopolitical_risk_score: number
          id: string
          notes: string | null
          risk_factors: Json | null
          supplier_id: string | null
          weather_risk_score: number
        }
        Insert: {
          assessed_at?: string | null
          assessed_by?: string | null
          geopolitical_risk_score: number
          id?: string
          notes?: string | null
          risk_factors?: Json | null
          supplier_id?: string | null
          weather_risk_score: number
        }
        Update: {
          assessed_at?: string | null
          assessed_by?: string | null
          geopolitical_risk_score?: number
          id?: string
          notes?: string | null
          risk_factors?: Json | null
          supplier_id?: string | null
          weather_risk_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_risk_assessments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_info: Json | null
          geopolitical_risk_score: number | null
          id: string
          last_assessment_date: string | null
          lead_time_days: number | null
          name: string
          reliability_score: number | null
          risk_factors: Json | null
          weather_risk_score: number | null
        }
        Insert: {
          contact_info?: Json | null
          geopolitical_risk_score?: number | null
          id?: string
          last_assessment_date?: string | null
          lead_time_days?: number | null
          name: string
          reliability_score?: number | null
          risk_factors?: Json | null
          weather_risk_score?: number | null
        }
        Update: {
          contact_info?: Json | null
          geopolitical_risk_score?: number | null
          id?: string
          last_assessment_date?: string | null
          lead_time_days?: number | null
          name?: string
          reliability_score?: number | null
          risk_factors?: Json | null
          weather_risk_score?: number | null
        }
        Relationships: []
      }
      supply_chain_scenarios: {
        Row: {
          created_at: string | null
          id: string
          results: Json | null
          status: string | null
          target_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          results?: Json | null
          status?: string | null
          target_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          results?: Json | null
          status?: string | null
          target_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tbl_actual_cost: {
        Row: {
          ActualCost: number | null
          Country: string | null
          Mode: string | null
          Segment: string | null
          Week: number | null
        }
        Insert: {
          ActualCost?: number | null
          Country?: string | null
          Mode?: string | null
          Segment?: string | null
          Week?: number | null
        }
        Update: {
          ActualCost?: number | null
          Country?: string | null
          Mode?: string | null
          Segment?: string | null
          Week?: number | null
        }
        Relationships: []
      }
      transport_scenarios: {
        Row: {
          air_to_sea_percentage: number
          country: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          results: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          air_to_sea_percentage: number
          country: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          results?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          air_to_sea_percentage?: number
          country?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          results?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          address: Json | null
          capacity: number | null
          id: string
          name: string
        }
        Insert: {
          address?: Json | null
          capacity?: number | null
          id?: string
          name: string
        }
        Update: {
          address?: Json | null
          capacity?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      critical_shipments: {
        Row: {
          actual_arrival: string | null
          created_at: string | null
          current_location: string | null
          current_status: string | null
          customer_id: string | null
          customs_status: string | null
          deleted_at: string | null
          destination_country: string | null
          estimated_arrival: string | null
          id: string | null
          is_expedited: boolean | null
          last_tracked_at: string | null
          notes: string | null
          origin_country: string | null
          priority_level: number | null
          shipping_mode: string | null
          tracking_number: string | null
          unit_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          customer_id?: string | null
          customs_status?: string | null
          deleted_at?: string | null
          destination_country?: string | null
          estimated_arrival?: string | null
          id?: string | null
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country?: string | null
          priority_level?: number | null
          shipping_mode?: string | null
          tracking_number?: string | null
          unit_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          customer_id?: string | null
          customs_status?: string | null
          deleted_at?: string | null
          destination_country?: string | null
          estimated_arrival?: string | null
          id?: string | null
          is_expedited?: boolean | null
          last_tracked_at?: string | null
          notes?: string | null
          origin_country?: string | null
          priority_level?: number | null
          shipping_mode?: string | null
          tracking_number?: string | null
          unit_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback_statistics: {
        Row: {
          avg_driver_rating: number | null
          avg_product_rating: number | null
          avg_setup_rating: number | null
          feedback_date: string | null
          overall_rating: number | null
          total_feedback: number | null
        }
        Relationships: []
      }
      inventory_view: {
        Row: {
          available_quantity: number | null
          avg_unit_price: number | null
          current_quantity: number | null
          days_since_last_sale: number | null
          last_restock_date: string | null
          last_sold_at: string | null
          name: string | null
          reserved_quantity: number | null
          total_value: number | null
          warehouse_count: number | null
        }
        Relationships: []
      }
      mv_transport_costs: {
        Row: {
          Cost: number | null
          Country: string | null
          Mode: string | null
          Week: number | null
          Year: number | null
        }
        Relationships: []
      }
      scenario_cost_summary: {
        Row: {
          Country: string | null
          Mode: string | null
          total_cost: number | null
          Week: number | null
        }
        Relationships: []
      }
      shipments_customer_view: {
        Row: {
          actual_arrival: string | null
          actualbilling: number | null
          carrier: string | null
          current_status: string | null
          customername: string | null
          destination_country: string | null
          estimated_arrival: string | null
          freightfund: string | null
          is_expedited: boolean | null
          last_tracked_at: string | null
          margincategory: string | null
          notes: string | null
          origin_country: string | null
          product_value: number | null
          profitability: number | null
          salesname: string | null
          shipment_cost: number | null
          shipping_mode: Database["public"]["Enums"]["shipping_mode"] | null
          tracking_number: string | null
          units: number | null
        }
        Relationships: []
      }
      supply_chain_kpi_view: {
        Row: {
          category: string | null
          current_status: string | null
          estimated_arrival: string | null
          id: string | null
          inventory_level: number | null
          priority_level: number | null
          product_name: string | null
          shipping_mode: Database["public"]["Enums"]["shipping_mode"] | null
          tracking_number: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      analyze_supply_chain_scenario: {
        Args: {
          p_scenario_id: string
        }
        Returns: Json
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      calculate_billing_audit_impact: {
        Args: {
          p_variance_threshold: number
        }
        Returns: Json
      }
      calculate_mode_switch_impact:
        | {
            Args: {
              p_margin_category?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_switch_percentage: number
              p_margin_category?: string
            }
            Returns: Json
          }
      calculate_scenario_impact: {
        Args: {
          p_country: string
          p_air_to_sea_percentage: number
        }
        Returns: Json
      }
      delete_old_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      execute_query: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      get_distinct_column_values: {
        Args: {
          table_name: string
          column_name: string
        }
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      alert_threshold_unit: "DAYS" | "WEEKS" | "MONTHS"
      cost_scenario_type: "AUDIT" | "MODE_SWITCH"
      feedback_category:
        | "product_functionality"
        | "setup_experience"
        | "driver_professionalism"
      food_category:
        | "SNACKS"
        | "DAIRY"
        | "MEAT"
        | "BEVERAGES"
        | "CONDIMENTS"
        | "PRODUCE"
        | "GRAINS"
        | "OTHER"
        | "HEALTH"
      forecast_confidence: "LOW" | "MEDIUM" | "HIGH"
      inventory_action: "ADD" | "REDUCE" | "DELETE"
      keyword_extraction_method: "keybert" | "spacy" | "yake" | "rake"
      market_trend: "up" | "down" | "stable"
      query_status: "pending" | "completed" | "failed"
      reallocation_status: "pending" | "in_progress" | "completed" | "cancelled"
      report_category: "inventory" | "sales" | "shipping" | "compliance"
      return_reason:
        | "WRONG_SIZE"
        | "DEFECTIVE"
        | "NOT_AS_DESCRIBED"
        | "CHANGED_MIND"
        | "ARRIVED_LATE"
        | "OTHER"
      return_status:
        | "PENDING"
        | "APPROVED"
        | "REJECTED"
        | "IN_TRANSIT"
        | "RECEIVED"
        | "COMPLETED"
      risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      risk_status: "active" | "mitigated" | "archived"
      rl_action_type: "DISCOUNT" | "BUNDLE" | "PROMOTION"
      shipping_mode: "sea" | "air" | "rail" | "road"
      storage_location: "FRIDGE" | "FREEZER" | "PANTRY"
      supply_chain_scenario_type:
        | "REVENUE_TARGET"
        | "INVENTORY_REBALANCE"
        | "TRANSIT_OPTIMIZATION"
        | "DELIVERY_COMMITMENT"
        | "CAPACITY_PLANNING"
      widget_type: "kpi" | "chart" | "table" | "list"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
